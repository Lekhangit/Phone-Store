import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const product_id = localStorage.getItem("product_id");
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!product_id) return;
    axios.get(`http://localhost:8000/products/${product_id}`)
      .then(res => setProduct(res.data))
      .catch(() => alert("Không tìm thấy sản phẩm"));
  }, [product_id]);

  const addToCart = () => {
    if (!user_id) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      return;
    }
    axios.post("http://localhost:8000/cart/", {
      user_id,
      items: [{ product_id, quantity }]
    }).then(() => alert("Đã thêm vào giỏ hàng!"))
      .catch(() => alert("Thêm vào giỏ hàng thất bại!"));
  };

  if (!product) return <div>Đang tải...</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <img src={`http://localhost:8000/${product.image}`} alt={product.name} style={{ width: 300 }} />
      <div>Thương hiệu: {product.brand}</div>
      <div>Giá: {product.price}₫</div>
      <div>Tồn kho: {product.stock}</div>
      <div>Đánh giá: {product.rating}</div>
      <div>{product.description}</div>
      <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
      <button onClick={addToCart}>Thêm vào giỏ hàng</button>
    </div>
  );
}