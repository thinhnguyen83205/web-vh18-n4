import { Row, Col, Card, Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9999/hotels")
      .then((res) => setHotels(res.data))
      .catch((error) => console.log(error));
  }, []);
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  const chonHotel = hotels.filter((h) =>
    (h.name || "").toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="container mt-3">
      <h1 className="text-center mb-4">Danh sách Khách sạn</h1>

      <Row className="mb-4 justify-content-center">
        <Col md={6}>
          <Form.Control
            type="search"
            value={search}
            onChange={handleSearch}
            placeholder="Tìm kiếm tên khách sạn..."
          />
        </Col>
      </Row>

      <Row>
        {chonHotel.map((h) => (
          <Col md={4} key={h.id} className="d-flex">
            <Card className="mb-4 p-2 w-100 shadow-sm">
              <div style={{ height: "200px", overflow: "hidden" }}>
                <Card.Img
                  variant="top"
                  src={h.image}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <h5 className="fw-bold mb-2">{h.name}</h5>
                  <p className="mb-1 text-muted small">
                    <b>Khu vực:</b> {h.location}
                  </p>
                  {h.specs && (
                    <p className="mb-1 text-muted small">
                      <b>Thông tin:</b>  {h.amenities.map((amenity, index) => (
                        <span key={index} className="badge bg-light text-dark border d-flex align-items-center gap-1 small fw-normal">
                          {amenity}
                        </span>
                      ))}
                    </p>
                  )}
                  <p className="mb-1 text-muted small">
                    <b>Đánh giá:</b>  {h.rating || "Chưa có"}
                  </p>
                  <p className="text-success fw-bold mb-3" style={{ fontSize: "1.1rem" }}>
                    {formatPrice(h.priceFrom)}
                  </p>
                </div>
                <Button variant="primary" className="w-100 mt-auto">Đặt phòng</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default HotelList;
