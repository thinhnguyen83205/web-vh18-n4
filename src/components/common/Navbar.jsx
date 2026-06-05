import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";

export const NAV_LINKS = [
  { label: "Trang chủ", route: "/" },
  { label: "Khách sạn", route: "/hotel-list" },
  { label: "Du lịch", route: "/tour-list" },
  { label: "Xe tự lái", route: "/car-list" },
  { label: "Máy bay", route: "/plane-list" },
];

export const NAV_TICKET_LINK = {
  label: "Vé của tôi",
  route: "/tickets",
};

export function isNavLinkActive(pathname, route) {
  if (route === "/") {
    return pathname === "/";
  }

  if (route === "/tickets") {
    return pathname === "/tickets" || pathname.startsWith("/detail");
  }

  return pathname === route || pathname.startsWith(`${route}/`);
}

function NavLinkButton({ link, pathname, onNavigate }) {
  const isActive = isNavLinkActive(pathname, link.route);

  return (
    <button
      type="button"
      className={`tg-nav-link${isActive ? " active" : ""}`}
      aria-current={isActive ? "page" : undefined}
      onClick={() => onNavigate(link.route)}
    >
      {link.label}
      {link.badge && <span className="tg-nav-badge">{link.badge}</span>}
    </button>
  );
}

export default function Navbar({
  onLoginClick,
  links = NAV_LINKS,
  ticketLink = NAV_TICKET_LINK,
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
      return;
    }
    navigate("/login");
  };

  return (
    <nav className="tg-nav">
      <button
        type="button"
        className="tg-logo"
        onClick={() => navigate("/")}
        aria-label="Về trang chủ TravelGo"
      >
        <div className="tg-logo-icon">✈</div>
        <span className="tg-logo-text">
          Travel<span>Go</span>
        </span>
      </button>

      <ul className="tg-nav-links">
        {links.map(link => (
          <li key={link.label}>
            <NavLinkButton
              link={link}
              pathname={pathname}
              onNavigate={navigate}
            />
          </li>
        ))}
      </ul>

      <div className="tg-nav-actions">
        <NavLinkButton
          link={ticketLink}
          pathname={pathname}
          onNavigate={navigate}
        />
        <Button variant="primary" size="md" onClick={handleLogin}>
          Đăng nhập
        </Button>
      </div>
    </nav>
  );
}
