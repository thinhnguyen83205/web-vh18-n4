import React from "react";
import "./App.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./components/login-page/login-form";
import HotelList from "./components/login-page/pages/HotelList";
import CarList from "./components/login-page/pages/CarList";
import TourList from "./components/login-page/pages/TourList";
import PlaneList from "./components/login-page/pages/PlaneList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/hotels" element={<HotelList />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/tours" element={<TourList />} />
        <Route path="/planes" element={<PlaneList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
