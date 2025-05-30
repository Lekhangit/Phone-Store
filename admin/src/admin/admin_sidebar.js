import React from "react";

export default function AdminSidebar({ setPage }) {
  return (
    <div style={{ width: 200, background: "#f5f5f5", height: "100vh", padding: 16 }}>
      <h3>Admin</h3>
      <div style={{ margin: "16px 0" }}>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
      </div>
      <div style={{ margin: "16px 0" }}>
        <button onClick={() => setPage("products")}>Quản lý sản phẩm</button>
      </div>
      <div style={{ margin: "16px 0" }}>
        <button onClick={() => setPage("users")}>Quản lý người dùng</button>
      </div>
      <div style={{ margin: "16px 0" }}>
        <button onClick={() => setPage("orders")}>Quản lý đơn hàng</button>
      </div>
    </div>
  );
}