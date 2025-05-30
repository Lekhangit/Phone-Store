import React, { useEffect, useState } from "react";
import { getCart } from '../../services/cartService';
import { createOrder } from '../../services/orderService';
import Button from '../../components/common/Button';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const user_id = localStorage.getItem("user_id");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (!user_id) return;
    const fetchCart = async () => {
      try {
        const data = await getCart(user_id);
        setCart(data);
      } catch (error) {
        alert("Không lấy được giỏ hàng");
      }
    };
    fetchCart();
  }, [user_id, reload]);

  const handleOrder = async () => {
    try {
      await createOrder(user_id, cart.items);
      alert("Đặt hàng thành công!");
      setCart({ items: [] });
    } catch (error) {
      alert("Đặt hàng thất bại!");
    }
  };

  if (!user_id) return <div>Bạn cần đăng nhập để xem giỏ hàng!</div>;
  if (!cart) return <div>Đang tải...</div>;
  if (!cart.items || cart.items.length === 0) return <div>Giỏ hàng trống</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2>Giỏ hàng</h2>
      {cart.items.map(item => (
        <div 
          key={item.product_id} 
          style={{ 
            border: "1px solid #eee", 
            borderRadius: 8, 
            padding: 12, 
            marginBottom: 12, 
            display: "flex", 
            alignItems: "center" 
          }}
        >
          <img 
            src={`http://localhost:8000/${item.image}`} 
            alt={item.name} 
            width={80} 
            style={{ marginRight: 16 }} 
          />
          <div>
            <div><b>{item.name}</b></div>
            <div>Thương hiệu: {item.brand}</div>
            <div>Giá: {item.price}₫</div>
            {item.sale_price && <div>Giá sale: {item.sale_price}₫</div>}
            <div>Đánh giá: {item.rating ?? "Chưa có"}</div>
            <div>Tồn kho: {item.stock ?? "N/A"}</div>
            <div>Mô tả: {item.description}</div>
            <div><b>Số lượng:</b> {item.quantity}</div>
          </div>
        </div>
      ))}
      <Button onClick={handleOrder}>Đặt hàng</Button>
    </div>
  );
} 