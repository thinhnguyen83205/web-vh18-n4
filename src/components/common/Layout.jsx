import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="tg-layout">
      <Navbar />
      <main className="tg-layout-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
