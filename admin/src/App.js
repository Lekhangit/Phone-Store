import React, { useState } from "react";
import AdminSidebar from "./admin/admin_sidebar";
import Dashboard from "./admin/dashboard";
import ManageProducts from "./admin/manageProducts";
import ManageUsers from "./admin/manageUsers";
import ManageOrders from "./admin/manageOrders";

function App() {
  const [page, setPage] = useState("dashboard");

  let content;
  if (page === "dashboard") content = <Dashboard />;
  if (page === "products") content = <ManageProducts />;
  if (page === "users") content = <ManageUsers />;
  if (page === "orders") content = <ManageOrders />;

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar setPage={setPage} />
      <div style={{ flex: 1, padding: 32 }}>{content}</div>
    </div>
  );
}

export default App;