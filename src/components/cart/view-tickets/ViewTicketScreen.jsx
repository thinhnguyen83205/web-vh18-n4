import { Button, Card } from "react-bootstrap";

function ViewTicketScreen({ ticket, onBack, formatPrice }) {
  return (
    <div className="view-ticket-screen">
      <Button variant="link" className="view-ticket-screen__back" onClick={onBack}>
        ← Quay lại
      </Button>

      <Card className="view-ticket-screen__card shadow">
        <Card.Img
          variant="top"
          src={ticket.image}
          className="view-ticket-screen__image"
        />

        <Card.Body className="p-4">
          <span className="badge bg-success mb-3">Đã thanh toán</span>

          <h2 className="fw-bold text-primary mb-3">
            {ticket.from} ✈ {ticket.to}
          </h2>

          <p className="mb-2">
            <b>Mã vé:</b> {ticket.id}
          </p>
          <p className="mb-2">
            <b>Hãng bay:</b> {ticket.airline}
          </p>
          <p className="mb-2">
            <b>Ngày bay:</b> {ticket.date}
          </p>
          <p className="mb-2">
            <b>Giờ bay:</b> {ticket.time}
          </p>
          <p className="text-danger fw-bold fs-5 mb-4">
            {formatPrice(ticket.price)}
          </p>

          <div className="view-ticket-screen__qr text-center p-3 mb-3">
            <p className="text-muted mb-0 small">
              Mã QR check-in (demo)
            </p>
            <p className="fw-bold mb-0 mt-2">{ticket.id}</p>
          </div>

          <Button variant="primary" className="w-100" onClick={onBack}>
            Đóng
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ViewTicketScreen;
