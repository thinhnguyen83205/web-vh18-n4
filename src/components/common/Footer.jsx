import { useNavigate } from "react-router-dom";

const FOOTER_LINKS = {
  "Dịch vụ": [
    { label: "Khách sạn", route: "/hotel-list" },
    { label: "Tour du lịch", route: "/tour-list" },
    { label: "Vé máy bay", route: "/plane-list" },
    { label: "Xe tự lái", route: "/car-list" },
  ],
  "Hỗ trợ": [
    { label: "Vé của tôi", route: "/tickets" },
    { label: "Trung tâm trợ giúp", route: "/" },
    { label: "Chính sách hoàn hủy", route: "/" },
    { label: "Liên hệ", route: "/" },
  ],
};

export default function Footer({ links = FOOTER_LINKS }) {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="tg-footer">
      <div className="tg-footer-inner">
        <div className="tg-footer-top">
          <div>
            <div className="tg-footer-col-title">Kết nối</div>
            <div className="tg-footer-social">
              <button
                type="button"
                className="tg-footer-social-btn"
                aria-label="Facebook"
              >
                f
              </button>
              <button
                type="button"
                className="tg-footer-social-btn"
                aria-label="Instagram"
              >
                ◎
              </button>
              <button
                type="button"
                className="tg-footer-social-btn"
                aria-label="YouTube"
              >
                ▶
              </button>
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <div className="tg-footer-col-title">{title}</div>
              <ul className="tg-footer-links">
                {items.map(item => (
                  <li key={item.label}>
                    <button
                      type="button"
                      className="tg-footer-link"
                      onClick={() => navigate(item.route)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="tg-footer-bottom">
          <span className="tg-footer-bottom__copy">
            © {year} TravelGo. Bảo lưu mọi quyền.
          </span>
          <span className="tg-footer-bottom__contact">
            Hotline: 1900 1234 · support@travelgo.vn
          </span>
        </div>
      </div>
    </footer>
  );
}
