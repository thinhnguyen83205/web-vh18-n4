import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAdmin } from "./utils/auth";
import AdminPage from "./components/admin-page/admin-page";
import LoginForm from "./components/login-page/login-form";
import HotelList from "./components/login-page/pages/HotelList";
import CarList from "./components/login-page/pages/CarList";
import TourList from "./components/login-page/pages/TourList";
import PlaneList from "./components/login-page/pages/PlaneList";

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
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="/hotels" element={<HotelList />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/tours" element={<TourList />} />
        <Route path="/planes" element={<PlaneList />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
