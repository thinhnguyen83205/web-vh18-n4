import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Card, Button } from "react-bootstrap";
import {
  ACTION_SIGNAL,
  TICKET_STATUS,
  TYPE_LABELS,
  applyActionSignal,
  countTicketsByStatus,
  filterTicketsByStatus,
  getTickets,
  initTicketsIfEmpty,
} from "../navigation-tickets/ticketButtonLogic";
import ViewTicketScreen from "../view-tickets/ViewTicketScreen";

const TAB_LABELS = {
  [TICKET_STATUS.PENDING]: "Chờ thanh toán",
  [TICKET_STATUS.PAID]: "Đã thanh toán",
  [TICKET_STATUS.CANCELLED]: "Đã hủy",
};

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}


function MyTicketsPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(TICKET_STATUS.PENDING);
  const [tickets, setTickets] = useState([]);
  const [viewingTicket, setViewingTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mỗi lần vào trang /tickets: đọc lại danh sách từ localStorage
  useEffect(() => {
    let cancelled = false;

    async function loadTickets() {
      setLoading(true);

      try {
        const savedTickets = getTickets();

        if (savedTickets.length > 0) {
          if (cancelled) {
            return;
          }

          setTickets(savedTickets);

          if (location.state?.justAdded) {
            setActiveTab(TICKET_STATUS.PENDING);
          }
          return;
        }

        const ticketList = await initTicketsIfEmpty();

        if (cancelled) {
          return;
        }

        setTickets(ticketList);
      } catch (error) {
        console.log(error);
        if (!cancelled) {
          setTickets(getTickets());
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTickets();

    return () => {
      cancelled = true;
    };
  }, [location.key, location.state?.justAdded]);

  const counts = countTicketsByStatus(tickets);
  const currentTickets = filterTicketsByStatus(tickets, activeTab);

  // Xử lý nút bấm: thanh toán / hủy / xóa
  const handleAction = (ticketId, signal) => {
    setTickets((prevTickets) => applyActionSignal(prevTickets, ticketId, signal));
  };

  if (viewingTicket) {
    return (
      <ViewTicketScreen
        ticket={viewingTicket}
        formatPrice={formatPrice}
        onBack={() => setViewingTicket(null)}
      />
    );
  }

  return (
    <div className="my-tickets-page">
      <h1 className="fw-bold mb-4 text-center">Vé của tôi</h1>

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

      {loading ? (
        <p className="text-muted">Đang tải danh sách vé...</p>
      ) : currentTickets.length === 0 ? (
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
                    {TYPE_LABELS[ticket.type] || ticket.type}
                  </span>
                  <h5 className="fw-bold text-primary">{ticket.title}</h5>

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
                            handleAction(ticket.id, ACTION_SIGNAL.PAY)
                          }
                        >
                          Thanh toán ngay
                        </Button>
                        <Button
                          variant="outline-danger"
                          className="w-100 mt-2"
                          onClick={() =>
                            handleAction(ticket.id, ACTION_SIGNAL.CANCEL)
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
                        <Button variant="secondary" className="w-100" disabled>
                          Đã hủy
                        </Button>
                        <Button
                          variant="outline-danger"
                          className="w-100 mt-2"
                          onClick={() =>
                            handleAction(ticket.id, ACTION_SIGNAL.DELETE)
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
