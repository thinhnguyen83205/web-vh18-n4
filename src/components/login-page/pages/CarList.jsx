import { Row, Col, Card, Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

function CarList() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9999/cars")
      .then((res) => setCars(res.data))
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

  const chonCar = cars.filter((c) =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container mt-3">
      <h1 className="text-center mb-4">Thuê Xe Tự Lái</h1>

      <Row className="mb-4 justify-content-center">
        <Col md={6}>
          <Form.Control
            type="search"
            value={search}
            onChange={handleSearch}
            placeholder="Tìm kiếm tên xe..."
          />
        </Col>
      </Row>

      <Row>
        {chonCar.map((c) => (
          <Col md={4} key={c.id} className="d-flex">
            <Card className="mb-4 p-2 w-100 shadow-sm">
              <div style={{ height: "200px", overflow: "hidden" }}>
                <Card.Img
                  variant="top"
                  src={c.image}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <h5 className="fw-bold mb-2">{c.name}</h5>
                  <p className="mb-1 text-muted small">
                    <b>Khu vực:</b> {c.location}
                  </p>
                  {c.specs && (
                    <p className="mb-1 text-muted small">
                      <b>Thông số:</b> {c.specs.seats} chỗ | {c.specs.fuel} | {c.specs.transmission}
                    </p>
                  )}
                  <p className="mb-1 text-muted small">
                    <b>Đánh giá:</b>  {c.rating || "Chưa có"}
                  </p>
                  <p className="text-success fw-bold mb-3" style={{ fontSize: "1.1rem" }}>
                    {formatPrice(c.priceFrom)}
                  </p>
                </div>
                <Button variant="primary" className="w-100 mt-auto">Thuê xe ngay</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default CarList;