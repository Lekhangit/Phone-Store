import React, { useEffect, useState } from "react";
import { getProductById } from '../../services/productService';
import { addToCart } from '../../services/cartService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const product_id = localStorage.getItem("product_id");
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!product_id) return;
    const fetchProduct = async () => {
      try {
        const data = await getProductById(product_id);
        setProduct(data);
      } catch (error) {
        alert("Không tìm thấy sản phẩm");
      }
    };
    fetchProduct();
  }, [product_id]);

  const handleAddToCart = async () => {
    if (!user_id) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      return;
    }
    try {
      await addToCart(user_id, [{ product_id, quantity }]);
      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      alert("Thêm vào giỏ hàng thất bại!");
    }
  };

  if (!product) return <div>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2>{product.name}</h2>
      <div style={{ display: 'flex', gap: '40px' }}>
        <img 
          src={`http://localhost:8000/${product.image}`} 
          alt={product.name} 
          style={{ width: 300 }} 
        />
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '10px' }}>Thương hiệu: {product.brand}</div>
          <div style={{ marginBottom: '10px' }}>Giá: {product.price}₫</div>
          <div style={{ marginBottom: '10px' }}>Tồn kho: {product.stock}</div>
          <div style={{ marginBottom: '10px' }}>Đánh giá: {product.rating}</div>
          <div style={{ marginBottom: '20px' }}>{product.description}</div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              style={{ width: '100px' }}
            />
            <Button onClick={handleAddToCart}>Thêm vào giỏ hàng</Button>
          </div>
        </div>
      </div>
    </div>
  );
} 