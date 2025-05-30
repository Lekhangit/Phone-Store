import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/orders?limit=100")
      .then(res => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>Quản lý đơn hàng</h2>
      {orders.map(order => (
        <div key={order.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div><b>Mã đơn hàng:</b> {order.id}</div>
          <div><b>User ID:</b> {order.user_id}</div>
          <div><b>Sản phẩm:</b></div>
          <ul>
            {order.items.map(item => (
              <li key={item.product_id} style={{ marginBottom: 8 }}>
                <img src={`http://localhost:8000/${item.image}`} alt={item.name} width={60} style={{ marginRight: 12, verticalAlign: "middle" }} />
                <b>{item.name}</b> | Thương hiệu: {item.brand} | Giá: {item.price}₫
                {item.sale_price && <> | Giá sale: {item.sale_price}₫</>}
                | Số lượng: {item.quantity}
                <br />
                Đánh giá: {item.rating ?? "Chưa có"} | Tồn kho: {item.stock ?? "N/A"}
                <br />
                Mô tả: {item.description}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}