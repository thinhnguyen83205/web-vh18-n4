import { Row, Col, Card, Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

function PlaneList() {
  const [flights, setFlights] = useState([]);
  const [search, setSearch] = useState("");
  const [sorts, setSorts] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9999/flights")
      .then((res) => setFlights(res.data))
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

  const chonFlight = flights.filter((f) =>
    (f.toFull || "").toLowerCase().includes(search.toLowerCase()) ||
    (f.airline || "").toLowerCase().includes(search.toLowerCase()),
  );
  const sapXepFlight = [...chonFlight].sort((a, b) => {
    if (sorts === "price-asc") {
      return a.priceFrom - b.priceFrom;
    } else if (sorts === "price-desc") {
      return b.priceFrom - a.priceFrom;
    }

    return 0;
  });

  return (
    <div className="container mt-3">
      <h1 className="text-center mb-4">Vé Máy Bay Giá Tốt</h1>

      <Row className="mb-4 justify-content-center">
        <Col md={6}>
          <Form.Control
            type="search"
            value={search}
            onChange={handleSearch}
            placeholder="Tìm hãng hàng không..."
          />
        </Col>
        <Col md={2}>
          <Form.Select value={sorts} onChange={(e) => setSorts(e.target.value)}>
            <option value="">Sắp xếp</option>
            <option value="price-asc">Giá Tăng dần</option>
            <option value="price-desc">Giá Giảm dần</option>
          </Form.Select>
        </Col>
      </Row>

      <Row>
        {sapXepFlight.map((f) => (
          <Col md={4} key={f.id} className="d-flex">
            <Card className="mb-4 p-2 w-100 shadow-sm">
              <div style={{ height: "140px", overflow: "hidden" }}>
                <Card.Img
                  variant="top"
                  src={f.image}
                  style={{ width: "100%", height: "100%", objectFit: "contain", padding: "10px" }}
                />
              </div>
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <h5 className="fw-bold text-center text-primary mb-3">
                    {f.fromFull} - {f.toFull}
                  </h5>
                  <p className="mb-1 text-muted small">
                    <b>Hãng bay:</b> {f.airline}
                  </p>
                  <p className="mb-1 text-muted small">
                    <b>Thời gian bay:</b> {f.duration}
                  </p>
                  {f.schedules && f.schedules.length > 0 && (
                    <p className="mb-1 text-muted small">
                      <b>Giờ khởi hành:</b> {f.schedules.join(" | ")}
                    </p>
                  )}
                  <p className="text-danger fw-bold my-2" style={{ fontSize: "1.1rem" }}>
                    Giá từ: {formatPrice(f.priceFrom)}
                  </p>
                </div>
                <Button variant="primary" className="w-100 mt-auto">Chọn chuyến bay</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default PlaneList;