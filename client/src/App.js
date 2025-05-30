import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./pages/home/Home";
import ProductDetail from "./pages/products/ProductDetail";
import Cart from "./pages/cart/Cart";
import Login from "./pages/auth/Login";
import OrderHistory from "./pages/orders/OrderHistory";
import GeminiChatbot from "./pages/chatbot/GeminiChatbot";

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Header />
        <main style={{ padding: '20px 0' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product-detail" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/chatbot" element={<GeminiChatbot />} />
            <Route path="*" element={<div>404 - Không tìm thấy trang</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;