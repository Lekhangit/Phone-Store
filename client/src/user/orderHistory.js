import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!user_id) return;
    axios.get("http://localhost:8000/orders?limit=100")
      .then(res => setOrders(res.data))
      .catch(() => alert("Không lấy được lịch sử đơn hàng"));
  }, [user_id]);

  if (!user_id) return <div>Bạn cần đăng nhập để xem lịch sử đơn hàng!</div>;

  return (
    <div>
      <h2>Lịch sử đơn hàng</h2>
      {orders.map(order => (
        <div key={order.id}>
          Đơn hàng ID: {order.id}
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