import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from '../../services/productService';
import Button from '../../components/common/Button';

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        alert("Không lấy được danh sách sản phẩm");
      }
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
      <h3>Danh sách sản phẩm</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {products.map((p) => (
          <div 
            key={p.id} 
            style={{
              border: "1px solid #eee", 
              borderRadius: 10, 
              padding: 12, 
              background: "#fff", 
              width: "23%"
            }}
          >
            <img 
              src={`http://localhost:8000/${p.image}`} 
              alt={p.name} 
              style={{ width: "100%", borderRadius: 8 }} 
            />
            <div style={{ fontWeight: "bold", fontSize: 16, margin: "8px 0 4px 0" }}>
              {p.name}
            </div>
            <div style={{ color: "#888" }}>Thương hiệu: {p.brand}</div>
            <div style={{ color: "#e53935", fontSize: 18, fontWeight: "bold" }}>
              {p.price}₫
            </div>
            <div>Đánh giá: ⭐ {p.rating ?? "Chưa có"}</div>
            <div>Tồn kho: {p.stock ?? "N/A"}</div>
            <Button 
              onClick={() => {
                localStorage.setItem("product_id", p.id);
                navigate("/product-detail");
              }}
              style={{ width: '100%', marginTop: '10px' }}
            >
              Xem chi tiết
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 