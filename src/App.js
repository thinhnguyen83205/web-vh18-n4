import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/common/Layout";
import HomePage from "./components/home/HomePage";
import CartPage from "./components/cart/disignt-tickets/MyTicketsPage";
import PlaneList from "./components/login-page/pages/PlaneList";
import HotelList from "./components/login-page/pages/HotelList";
import CarList from "./components/login-page/pages/CarList";
import TourList from "./components/login-page/pages/TourList";
import ViewTicketsDetail from "./components/view-tickets-detail/ViewTicketsDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tickets" element={<CartPage />} />
          <Route path="/detail" element={<ViewTicketsDetail />} />
          <Route path="/plane-list" element={<PlaneList />} />
          <Route path="/hotel-list" element={<HotelList />} />
          <Route path="/car-list" element={<CarList />} />
          <Route path="/tour-list" element={<TourList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
