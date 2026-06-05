import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";
import {
  ACTION_SIGNAL,
  TICKET_STATUS,
  applyActionSignal,
  countTicketsByStatus,
  createInitialTickets,
  createInitialHotels,
  createInitialCars,
  consumePendingBooking,
} from "../navigation-tickets/ticketButtonLogic";
import ViewTicketScreen from "../view-tickets/ViewTicketScreen";

// Label cho các tab
const TAB_LABELS = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  cancelled: "Đã hủy",
};
// state 4 biến react useState để quản lý trạng thái của component
function MyTicketsPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(TICKET_STATUS.PENDING);
  const [tickets, setTickets] = useState([]);
  const [viewingTicket, setViewingTicket] = useState(null);

  useEffect(() => {
    const newBooking = consumePendingBooking();
    let cancelled = false;
    // Lấy dữ liệu từ API và tạo vé
    Promise.all([
      axios.get("http://localhost:9999/flights"),
      axios.get("http://localhost:9999/hotels"),
      axios.get("http://localhost:9999/cars"),
    ])
      .then(([flightsRes, hotelsRes, carsRes]) => {
        if (cancelled) {
          return;
        }
        // Tạo danh sách vé từ dữ liệu API
        const all = [
          ...createInitialTickets(flightsRes.data),
          ...createInitialHotels(hotelsRes.data),
          ...createInitialCars(carsRes.data),
        ];
        // Thêm vé mới nếu có
        if (newBooking) {
          const filtered = all.filter((t) => t.id !== newBooking.id);
          setTickets([newBooking, ...filtered]);
          setActiveTab(TICKET_STATUS.PENDING);
          return;
        }

        setTickets(all);
      })
      .catch((error) => console.log(error));

    // Hủy đặt vé mới nếu có
    return () => {
      cancelled = true;
    };
    // Cleanup khi component unmount
  }, [location.key]);

  // Đếm số vé từng tab
  const counts = countTicketsByStatus(tickets);

  const sendSignal = (ticketId, signal) => {
    setTickets((prev) => applyActionSignal(prev, ticketId, signal));
  };

  // Lọc vé theo trạng thái
  const pendingTickets = tickets.filter(
    (t) => t.status === TICKET_STATUS.PENDING,
  );

  const paidTickets = tickets.filter(
    (t) => t.status === TICKET_STATUS.PAID,
  );

  const cancelledTickets = tickets.filter(
    (t) => t.status === TICKET_STATUS.CANCELLED,
  );

  // Chọn danh sách hiển thị
  let currentTickets = [];

  if (activeTab === TICKET_STATUS.PENDING) {
    currentTickets = pendingTickets;
  }

  if (activeTab === TICKET_STATUS.PAID) {
    currentTickets = paidTickets;
  }

  if (activeTab === TICKET_STATUS.CANCELLED) {
    currentTickets = cancelledTickets;
  }

  // Định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Hiển thị vé đang xem
  if (viewingTicket) {
    return (
      <ViewTicketScreen
        ticket={viewingTicket}
        formatPrice={formatPrice}
        onBack={() => setViewingTicket(null)}
      />
    );
  }
  // Hiển thị danh sách vé
  return (
    <div className="my-tickets-page">
      <h1 className="fw-bold mb-4 text-center">
        Vé của tôi
      </h1>
    
      {/* Tabs */}
      <div
        className="d-flex mb-4 p-2 mx-auto"
        style={{
          maxWidth: "600px",
          background: "#f1f3f5",
          borderRadius: "12px",
        }}
      >
       
        <Button
          variant={activeTab === TICKET_STATUS.PENDING ? "light" : "link"}
          className="flex-fill text-decoration-none"
          onClick={() => setActiveTab(TICKET_STATUS.PENDING)}
        >
          Chờ thanh toán ({counts.pending})
        </Button>

        <Button
          variant={activeTab === TICKET_STATUS.PAID ? "light" : "link"}
          className="flex-fill text-decoration-none"
          onClick={() => setActiveTab(TICKET_STATUS.PAID)}
        >
          Đã thanh toán ({counts.paid})
        </Button>

        <Button
          variant={activeTab === TICKET_STATUS.CANCELLED ? "light" : "link"}
          className="flex-fill text-decoration-none"
          onClick={() => setActiveTab(TICKET_STATUS.CANCELLED)}
        >
          Đã hủy ({counts.cancelled})
        </Button>
      </div>

      {/* Danh sách vé */}
      {currentTickets.length === 0 ? (
        // Hiển thị thông báo nếu không có vé
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            height: "200px",
            background: "#f8f9fa",
            borderRadius: "12px",
          }}
        >
          <p className="text-muted">
            Chưa có vé nào ở mục {TAB_LABELS[activeTab]}.
          </p>
        </div>
      ) : (
        <Row className="justify-content-center g-4">
          {currentTickets.map((ticket) => (
            <Col
              xs={12}
              sm={10}
              md={6}
              lg={4}
              key={ticket.id}
              className="my-tickets-page__card-col"
            >
              <Card className="my-tickets-page__card mb-0 shadow-sm h-100">
                <Card.Img
                  variant="top"
                  src={ticket.image}
                  style={{
                    height: "180px",
                    objectFit: "cover",
                  }}
                />
                <Card.Body>
                  <span className="badge bg-secondary mb-2">
                    {ticket.type === "flight" ? "✈ Máy bay" : ticket.type === "hotel" ? "🏨 Khách sạn" : "🚗 Ô tô"}
                  </span>
                  <h5 className="fw-bold text-primary">
                    {ticket.title}
                  </h5>

                  {ticket.subtitle && (
                    <p className="mb-1 text-muted small">{ticket.subtitle}</p>
                  )}

                  {ticket.detail && (
                    <p className="mb-1 text-muted small">{ticket.detail}</p>
                  )}

                  <p className="text-danger fw-bold mb-0">
                    {formatPrice(ticket.price)}
                  </p>

                  <div className="my-tickets-page__card-actions">
                    {ticket.status === TICKET_STATUS.PENDING && (
                      <>
                        <Button
                          variant="success"
                          className="w-100"
                          onClick={() =>
                            sendSignal(ticket.id, ACTION_SIGNAL.PAY)
                          }
                        >
                          Thanh toán ngay
                        </Button>
                        <Button
                          variant="outline-danger"
                          className="w-100 mt-2"
                          onClick={() =>
                            sendSignal(ticket.id, ACTION_SIGNAL.CANCEL)
                          }
                        >
                          Hủy
                        </Button>
                      </>
                    )}
                    {ticket.status === TICKET_STATUS.PAID && (
                      <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => setViewingTicket(ticket)}
                      >
                        Xem vé
                      </Button>
                    )}
                    {ticket.status === TICKET_STATUS.CANCELLED && (
                      <>
                        <Button
                          variant="secondary"
                          className="w-100"
                          disabled
                        >
                          Đã hủy
                        </Button>
                        <Button
                          variant="outline-danger"
                          className="w-100 mt-2"
                          onClick={() =>
                            sendSignal(ticket.id, ACTION_SIGNAL.DELETE)
                          }
                        >
                          Xóa
                        </Button>
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default MyTicketsPage;