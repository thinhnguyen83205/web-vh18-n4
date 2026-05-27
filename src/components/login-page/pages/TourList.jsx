import { Row, Col, Card, Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

function TourList() {
  const [tours, setTours] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9999/tours")
      .then((res) => setTours(res.data))
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

  const chonTour = tours.filter((t) =>
    (t.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="text-center mt-3 container">
      <h1>All Tours</h1>

      <Row className="mb-3 justify-content-center">
        <Col md={6}>
          <Form.Control
            type="search"
            value={search}
            onChange={handleSearch}
            placeholder="Search by tour name..."
          />
        </Col>
      </Row>

      <Row>
        {chonTour.map((t) => (
          <Col md={4} key={t.id}>
            <Card className="mb-3 p-2">
              {t.image && (
                <div style={{ height: "200px", overflow: "hidden" }}>
                  <Card.Img
                    variant="top"
                    src={t.image}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}
              <Card.Body className="text-start">
                <h6 className="fw-bold text-truncate">{t.name}</h6>

                <p className="mb-1">
                  <b>Location:</b> {t.location}
                </p>

                <p className="mb-1">
                  <b>Duration:</b> {t.duration}
                </p>

                <p className="mb-1">
                  <b>Rating:</b> ⭐ {t.rating || "N/A"}
                </p>

                <p className="mb-3">
                  <b>Price From:</b> <span className="text-danger fw-bold">{formatPrice(t.priceFrom)}</span>
                </p>

                <Button variant="primary" className="w-100">Detail</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default TourList;