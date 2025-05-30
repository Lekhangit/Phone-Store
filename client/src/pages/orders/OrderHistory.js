import React, { useEffect, useState } from "react";
import { getOrders } from '../../services/orderService';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!user_id) return;
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        alert("Không lấy được lịch sử đơn hàng");
      }
    };
    fetchOrders();
  }, [user_id]);

  if (!user_id) return <div>Bạn cần đăng nhập để xem lịch sử đơn hàng!</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2>Lịch sử đơn hàng</h2>
      {orders.map(order => (
        <div 
          key={order.id}
          style={{
            border: '1px solid #eee',
            borderRadius: 8,
            padding: 16,
            marginBottom: 16
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: 12 }}>
            Đơn hàng ID: {order.id}
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {order.items.map(item => (
              <li 
                key={item.product_id} 
                style={{ 
                  marginBottom: 16,
                  padding: 12,
                  border: '1px solid #f0f0f0',
                  borderRadius: 8
                }}
              >
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img 
                    src={`http://localhost:8000/${item.image}`} 
                    alt={item.name} 
                    width={60} 
                    style={{ borderRadius: 4 }}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                    <div>Thương hiệu: {item.brand}</div>
                    <div>Giá: {item.price}₫</div>
                    {item.sale_price && <div>Giá sale: {item.sale_price}₫</div>}
                    <div>Số lượng: {item.quantity}</div>
                    <div>Đánh giá: {item.rating ?? "Chưa có"}</div>
                    <div>Tồn kho: {item.stock ?? "N/A"}</div>
                    <div style={{ marginTop: 8 }}>{item.description}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
} 