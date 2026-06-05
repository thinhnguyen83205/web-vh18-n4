import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { isAdmin } from "./utils/auth";
import Layout from "./components/common/Layout";
import HomePage from "./components/home/HomePage";
import CartPage from "./components/cart/disignt-tickets/MyTicketsPage";
import AdminPage from "./components/admin-page/admin-page";
import LoginForm from "./components/login-page/login-form";
import PlaneList from "./components/login-page/pages/PlaneList";
import HotelList from "./components/login-page/pages/HotelList";
import CarList from "./components/login-page/pages/CarList";
import TourList from "./components/login-page/pages/TourList";
import ViewTicketsDetail from "./components/view-tickets-detail/ViewTicketsDetail";

function AdminRoute({ children }) {
  if (!isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tickets" element={<CartPage />} />
          <Route path="/detail" element={<ViewTicketsDetail />} />
          <Route path="/plane-list" element={<PlaneList />} />
          <Route path="/hotel-list" element={<HotelList />} />
          <Route path="/car-list" element={<CarList />} />
          <Route path="/tour-list" element={<TourList />} />
          <Route path="/hotels" element={<HotelList />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/tours" element={<TourList />} />
          <Route path="/planes" element={<PlaneList />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
