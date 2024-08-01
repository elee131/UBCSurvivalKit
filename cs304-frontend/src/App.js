import React from "react";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Request from "./pages/Request";
import AdminPage from "./pages/AdminPage";
import APITest from "./pages/APITest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/request" element={<Request />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/testing" element={<APITest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
