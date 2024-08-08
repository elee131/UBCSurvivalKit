import React from "react";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Request from "./pages/Request";
import Utilities from "./pages/Utilities";
import Cafes from "./pages/Cafes";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import Features from "./pages/Features";
import APITest from "./pages/APITest";
import FullDBPage from "./pages/FullDBPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/request" element={<Request />} />
        <Route path="/utilities" element={<Utilities />} />
        <Route path="/cafes" element={<Cafes />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/dbpage" element={<FullDBPage />} />
        <Route path="/testing" element={<APITest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
