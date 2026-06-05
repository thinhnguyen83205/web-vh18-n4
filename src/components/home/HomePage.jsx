import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import database from "../../database.json";

function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function fuzzyMatch(text, query) {
  if (!text) return false;
  return removeVietnameseTones(String(text)).includes(
    removeVietnameseTones(query.trim()),
  );
}

function buildSearchIndex() {
  const items = [];
  (database.hotels || []).forEach(h =>
    items.push({
      id: h.id,
      type: "hotel",
      typeLabel: "Khách sạn",
      name: h.name,
      location: h.location,
      price: h.priceFrom,
      image: h.image,
      rating: h.rating,
      route: "/hotel-list",
      item: h,
    }),
  );
  (database.tours || []).forEach(t =>
    items.push({
      id: t.id,
      type: "tour",
      typeLabel: "Du lịch",
      name: t.name,
      location: t.location,
      price: t.priceFrom,
      image: t.image,
      rating: t.rating,
      route: "/tour-list",
      item: t,
    }),
  );
  (database.flights || []).forEach(f =>
    items.push({
      id: f.id,
      type: "flight",
      typeLabel: "Máy bay",
      name: f.name || `${f.from} → ${f.to}`,
      location: f.fromFull || f.from,
      price: f.priceFrom,
      image: f.image,
      rating: f.rating,
      route: "/plane-list",
      item: f,
    }),
  );
  (database.cars || []).forEach(c =>
    items.push({
      id: c.id,
      type: "car",
      typeLabel: "Xe tự lái",
      name: c.name,
      location: c.location,
      price: c.priceFrom,
      image: c.image,
      rating: c.rating,
      route: "/car-list",
      item: c,
    }),
  );
  return items;
}

const ALL_ITEMS = buildSearchIndex();

const TYPE_ICON = { hotel: "🏨", tour: "🗺️", flight: "✈️", car: "🚗" };

const QUICK_TAGS = ["Đà Nẵng", "Hà Nội", "Sapa", "Hạ Long", "Vinpearl"];

const CATEGORIES = [
  { label: "Khách sạn", desc: "Đặt phòng nghỉ", icon: "🏨", route: "/hotel-list", tone: "hotel" },
  { label: "Du lịch", desc: "Tour trọn gói", icon: "🗺️", route: "/tour-list", tone: "tour" },
  { label: "Xe tự lái", desc: "Thuê xe linh hoạt", icon: "🚗", route: "/car-list", tone: "car" },
  { label: "Máy bay", desc: "Vé bay giá tốt", icon: "✈️", route: "/plane-list", tone: "flight" },
  { label: "Vé của tôi", desc: "Quản lý đặt chỗ", icon: "🎫", route: "/tickets", tone: "ticket" },
];

/* eslint-disable react-hooks/set-state-in-effect */
export default function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSugg] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [results, setResults] = useState(null);
  const [searchedQ, setSearchedQ] = useState("");
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setSugg([]);
      setShowSugg(false);
      return;
    }
    const hits = ALL_ITEMS.filter(
      i => fuzzyMatch(i.name, query) || fuzzyMatch(i.location, query),
    ).slice(0, 7);
    setSugg(hits);
    setShowSugg(hits.length > 0);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowSugg(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function doSearch(q) {
    const kw = (q || query).trim();
    if (!kw) return;
    const hits = ALL_ITEMS.filter(
      i => fuzzyMatch(i.name, kw) || fuzzyMatch(i.location, kw),
    );
    setResults(hits);
    setSearchedQ(kw);
    setShowSugg(false);
  }

  function pickSuggestion(item) {
    setQuery(item.name);
    setShowSugg(false);
    doSearch(item.name);
  }

  function formatPrice(p) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(p);
  }

  function clearResults() {
    setResults(null);
    setQuery("");
    setSearchedQ("");
  }

  function openDetail(result) {
    navigate("/detail", {
      state: {
        type: result.type,
        item: result.item,
        listPath: "/",
      },
    });
  }

  return (
    <div className="home-page container mt-3">
      <h1 className="text-center mb-4">Khám Phá Dịch Vụ Du Lịch</h1>

      <Row className="justify-content-center mb-4">
        <Col md={10} lg={7}>
          <div className="home-page__search-box">
            <p className="fw-semibold mb-2">Bạn muốn đi đâu?</p>
            <div className="home-page__search" ref={wrapRef}>
              <span className="home-page__search-icon" aria-hidden="true">🔍</span>
              <Form.Control
                type="search"
                className="home-page__search-input"
                placeholder="Nhập điểm đến, khách sạn, tour..."
                value={query}
                autoComplete="off"
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") doSearch();
                  if (e.key === "Escape") setShowSugg(false);
                }}
                onFocus={() => suggestions.length > 0 && setShowSugg(true)}
              />
              {showSugg && (
                <div className="home-page__suggestions">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="home-page__suggestion-item"
                      onMouseDown={() => pickSuggestion(item)}
                    >
                      <span className="fs-5">{TYPE_ICON[item.type]}</span>
                      <span className="flex-grow-1 text-start">
                        <strong>{item.name}</strong>
                        <small className="d-block text-muted">{item.location}</small>
                      </span>
                      <span className="badge bg-light text-primary border">
                        {item.typeLabel}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="primary"
              className="w-100 mt-3"
              size="lg"
              onClick={() => doSearch()}
            >
              Tìm kiếm
            </Button>

            <div className="home-page__tags mt-3">
              <span className="text-muted small">Gợi ý:</span>
              {QUICK_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className="home-page__tag"
                  onClick={() => {
                    setQuery(tag);
                    doSearch(tag);
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {results !== null ? (
        <>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold mb-0">
              Kết quả cho: &quot;{searchedQ}&quot;
              <span className="text-muted fw-normal ms-2">
                ({results.length})
              </span>
            </h5>
            <Button variant="link" className="text-decoration-none" onClick={clearResults}>
              Xóa kết quả
            </Button>
          </div>

          {results.length === 0 ? (
            <div className="home-page__empty text-center text-muted py-5">
              <div className="fs-1 mb-2">🔍</div>
              <p className="mb-1 fw-semibold">Không tìm thấy kết quả</p>
              <p className="mb-0 small">
                Thử từ khóa khác như &quot;Đà Nẵng&quot;, &quot;Vinpearl&quot;…
              </p>
            </div>
          ) : (
            <Row className="g-4">
              {results.map((item, i) => (
                <Col md={6} lg={4} key={i} className="d-flex">
                  <Card className="mb-4 p-2 w-100 shadow-sm">
                    <div style={{ height: "200px", overflow: "hidden" }}>
                      {item.image && !item.image.startsWith("data:") ? (
                        <Card.Img
                          variant="top"
                          src={item.image}
                          alt={item.name}
                          className="home-page__card-img"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div className="home-page__card-img home-page__card-img--placeholder">
                          {TYPE_ICON[item.type]}
                        </div>
                      )}
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <span className="badge bg-secondary mb-2 align-self-start">
                        {TYPE_ICON[item.type]} {item.typeLabel}
                      </span>
                      <h5 className="fw-bold mb-2">{item.name}</h5>
                      <p className="text-muted small mb-1">📍 {item.location}</p>
                      {item.rating && (
                        <p className="text-muted small mb-2">★ {item.rating}</p>
                      )}
                      <p
                        className="text-danger fw-bold mb-3"
                        style={{ fontSize: "1.1rem" }}
                      >
                        {formatPrice(item.price)}
                      </p>
                      <Button
                        variant="primary"
                        className="w-100 mt-auto"
                        onClick={() => openDetail(item)}
                      >
                        Xem chi tiết
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      ) : (
        <>
          <h5 className="fw-bold text-center mb-3">Khám phá dịch vụ</h5>
          <Row className="g-3 justify-content-center">
            {CATEGORIES.map(cat => (
              <Col xs={6} md={4} lg={4} key={cat.label}>
                <Card
                  className={`home-page__category home-page__category--${cat.tone} h-100`}
                  role="button"
                  onClick={() => navigate(cat.route)}
                >
                  <Card.Body className="d-flex align-items-center gap-3 py-3 px-3">
                    <div className="home-page__category-icon-wrap">
                      <span className="fs-4">{cat.icon}</span>
                    </div>
                    <div className="text-start">
                      <div className="fw-semibold">{cat.label}</div>
                      <small className="text-muted">{cat.desc}</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
}
