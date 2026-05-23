import { useMemo, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import database from "../database.json";

const STATUS_CYCLE = ["pending", "paid", "cancelled"];

const TAB_LABELS = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  cancelled: "Đã hủy",
};

function MyTicketsPage() {
  const [activeTab, setActiveTab] = useState("pending");

  const tickets = useMemo(
    () =>
      database.flights.map((flight, index) => ({
        id: flight.id,
        image: flight.image,
        from: flight.fromFull || flight.from,
        to: flight.toFull || flight.to,
        airline: flight.airline,
        date: "23/05/2026",
        time: flight.schedules?.[0] ?? "",
        price: flight.priceFrom,
        status: STATUS_CYCLE[index % STATUS_CYCLE.length],
      })),
    [],
  );

  // Lọc vé theo trạng thái
  const pendingTickets = tickets.filter(
    (t) => t.status === "pending",
  );

  const paidTickets = tickets.filter(
    (t) => t.status === "paid",
  );

  const cancelledTickets = tickets.filter(
    (t) => t.status === "cancelled",
  );

  // Chọn danh sách hiển thị
  let currentTickets = [];

  if (activeTab === "pending") {
    currentTickets = pendingTickets;
  }

  if (activeTab === "paid") {
    currentTickets = paidTickets;
  }

  if (activeTab === "cancelled") {
    currentTickets = cancelledTickets;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

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
          variant={activeTab === "pending" ? "light" : "link"}
          className="flex-fill text-decoration-none"
          onClick={() => setActiveTab("pending")}
        >
          Chờ thanh toán ({pendingTickets.length})
        </Button>

        <Button
          variant={activeTab === "paid" ? "light" : "link"}
          className="flex-fill text-decoration-none"
          onClick={() => setActiveTab("paid")}
        >
          Đã thanh toán ({paidTickets.length})
        </Button>

        <Button
          variant={activeTab === "cancelled" ? "light" : "link"}
          className="flex-fill text-decoration-none"
          onClick={() => setActiveTab("cancelled")}
        >
          Đã hủy ({cancelledTickets.length})
        </Button>
      </div>

      {/* Danh sách vé */}
      {currentTickets.length === 0 ? (
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
              <Card className="my-tickets-page__card mb-0 shadow-sm">
                <Card.Img
                  variant="top"
                  src={ticket.image}
                  style={{
                    height: "180px",
                    objectFit: "cover",
                  }}
                />

                <Card.Body>
                  <h5 className="fw-bold text-primary">
                    {ticket.from} ✈ {ticket.to}
                  </h5>

                  <p className="mb-1">
                    <b>Hãng bay:</b> {ticket.airline}
                  </p>

                  <p className="mb-1">
                    <b>Ngày bay:</b> {ticket.date}
                  </p>

                  <p className="mb-1">
                    <b>Giờ bay:</b> {ticket.time}
                  </p>

                  <p className="text-danger fw-bold">
                    {formatPrice(ticket.price)}
                  </p>

                  {ticket.status === "pending" && (
                    <Button variant="success" className="w-100">
                      Thanh toán ngay
                    </Button>
                  )}

                  {ticket.status === "paid" && (
                    <Button variant="primary" className="w-100">
                      Xem vé
                    </Button>
                  )}

                  {ticket.status === "cancelled" && (
                    <Button
                      variant="secondary"
                      className="w-100"
                      disabled
                    >
                      Đã hủy
                    </Button>
                  )}
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