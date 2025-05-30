import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./user/home";
import ProductDetail from "./user/productDetail";
import Cart from "./user/cart";
import Login from "./user/login";
import OrderHistory from "./user/orderHistory";
import GeminiChatbot from "./user/geminiChatbot";

function App() {
  return (
    <BrowserRouter>
      <div style={{ background: "#FFD600", padding: 16, display: "flex", alignItems: "center" }}>
        <Link to="/" style={{ marginRight: 32, fontWeight: "bold", fontSize: 24, color: "#000", textDecoration: "none" }}>
          thegioididong
        </Link>
        <input style={{ marginLeft: 32, width: 400, height: 36, borderRadius: 8, border: "1px solid #ccc", paddingLeft: 12 }} placeholder="Bạn tìm gì..." />
        <div style={{ flex: 1 }}></div>
        <Link to="/login" style={{ marginRight: 32, fontSize: 18 }}>Đăng nhập</Link>
        <Link to="/cart" style={{ marginRight: 32, fontSize: 18 }}>🛒 Giỏ hàng</Link>
        <Link to="/order-history" style={{ marginRight: 32, fontSize: 18 }}>📜 Đơn hàng</Link>
        <Link to="/chatbot" style={{ marginRight: 32, fontSize: 18 }}>🤖 Chatbot</Link>
        <span style={{ marginRight: 32, fontSize: 18 }}>📍 Hồ Chí Minh</span>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/chatbot" element={<GeminiChatbot />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;