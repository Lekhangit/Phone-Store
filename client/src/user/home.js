import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/products?limit=100")
      .then(res => setProducts(res.data))
      .catch(() => alert("Không lấy được danh sách sản phẩm"));
  }, []);

  return (
    <div>
      {/* Header, banner, filter... */}
      <h3>Danh sách sản phẩm</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {products.map((p, idx) => (
          <div key={p.id} style={{
            border: "1px solid #eee", borderRadius: 10, padding: 12, background: "#fff", width: "23%"
          }}>
            <img src={`http://localhost:8000/${p.image}`} alt={p.name} style={{ width: "100%", borderRadius: 8 }} />
            <div style={{ fontWeight: "bold", fontSize: 16, margin: "8px 0 4px 0" }}>{p.name}</div>
            <div style={{ color: "#888" }}>Thương hiệu: {p.brand}</div>
            <div style={{ color: "#e53935", fontSize: 18, fontWeight: "bold" }}>{p.price}₫</div>
            <div>Đánh giá: ⭐ {p.rating ?? "Chưa có"}</div>
            <div>Tồn kho: {p.stock ?? "N/A"}</div>
            <button onClick={() => {
              localStorage.setItem("product_id", p.id);
              navigate("/product-detail");
            }}>Xem chi tiết</button>
          </div>
        ))}
      </div>
    </div>
  );
}