import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Col, Row } from "react-bootstrap";
import {
  addTicket,
  mapItemToPendingTicket,
} from "../cart/navigation-tickets/ticketButtonLogic";

// Label cho các loại vé
const TYPE_LABELS = {
  flight: "✈ Máy bay",
  hotel: "🏨 Khách sạn",
  car: "🚗 Ô tô",
  tour: "🎒 Tour",
};

// Label cho các nút đặt vé
const BOOK_LABELS = {
  flight: "Đặt vé",
  hotel: "Đặt phòng",
  car: "Thuê xe",
  tour: "Đặt tour",
};

// Component hiển thị thông tin chi tiết vé
function ViewTicketsDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, item, listPath = "/" } = location.state || {};

  // Định dạng giá tiền
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // Hiển thị thông báo nếu không tìm thấy thông tin chi tiết
  if (!type || !item) {
    return (
      <div className="container mt-4 text-center">
        <p className="text-muted">Không tìm thấy thông tin chi tiết.</p>
        <Button variant="primary" onClick={() => navigate(listPath)}>
          Quay lại
        </Button>
      </div>
    );
  }

  // Xử lý đặt vé
  const handleBook = () => {
    const newTicket = mapItemToPendingTicket(type, item);
    addTicket(newTicket);
    navigate("/tickets", { state: { justAdded: true } });
  };

  // Hiển thị thông tin chi tiết vé
  return (
    <div className="container mt-3 mb-5">
      <Button
        variant="link"
        className="text-decoration-none ps-0 mb-3"
        onClick={() => navigate(listPath)}
      >
        ← Quay lại danh sách
      </Button>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            {item.image && (
              <Card.Img
                variant="top"
                src={item.image}
                style={{ height: "280px", objectFit: "cover" }}
              />
            )}

            <Card.Body className="p-4">
              <span className="badge bg-secondary mb-2">
                {TYPE_LABELS[type]}
              </span>

              <h2 className="fw-bold text-primary mb-3">
                {type === "flight"
                  ? `${item.fromFull || item.from} ✈ ${item.toFull || item.to}`
                  : item.name}
              </h2>

              {item.description && (
                <p className="text-muted">{item.description}</p>
              )}

              {type === "flight" && (
                <>
                  <p className="mb-1">
                    <b>Hãng bay:</b> {item.airline}
                  </p>
                  <p className="mb-1">
                    <b>Thời gian bay:</b> {item.duration}
                  </p>
                  {item.schedules?.length > 0 && (
                    <p className="mb-1">
                      <b>Giờ khởi hành:</b> {item.schedules.join(" | ")}
                    </p>
                  )}
                </>
              )}

              {type === "hotel" && (
                <>
                  <p className="mb-1">
                    <b>Khu vực:</b> {item.location}
                  </p>
                  <p className="mb-1">
                    <b>Đánh giá:</b> {item.rating || "Chưa có"}
                  </p>
                </>
              )}

              {type === "car" && (
                <>
                  <p className="mb-1">
                    <b>Khu vực:</b> {item.location}
                  </p>
                  {item.specs && (
                    <p className="mb-1">
                      <b>Thông số:</b> {item.specs.seats} chỗ | {item.specs.fuel}{" "}
                      | {item.specs.transmission}
                    </p>
                  )}
                  <p className="mb-1">
                    <b>Đánh giá:</b> {item.rating || "Chưa có"}
                  </p>
                </>
              )}

              {type === "tour" && (
                <>
                  <p className="mb-1">
                    <b>Địa điểm:</b> {item.location}
                  </p>
                  <p className="mb-1">
                    <b>Thời lượng:</b> {item.duration}
                  </p>
                  <p className="mb-1">
                    <b>Đánh giá:</b> ⭐ {item.rating || "N/A"}
                  </p>
                </>
              )}

              {item.pricing?.length > 0 && (
                <div className="mt-3 mb-3">
                  <h5 className="fw-bold">Bảng giá</h5>
                  <ul className="list-group">
                    {item.pricing.map((p, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>{p.class || p.group}</span>
                        <span className="text-danger fw-bold">
                          {formatPrice(p.price ?? p.pricePerDay)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-danger fw-bold fs-4 mb-4">
                Giá từ: {formatPrice(item.priceFrom)}
              </p>

              <div className="d-grid gap-2">
                <Button variant="success" size="lg" onClick={handleBook}>
                  {BOOK_LABELS[type]}
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate(listPath)}>
                  Hủy
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ViewTicketsDetail;
