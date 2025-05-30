import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    image: "",
    rating: "",
    stock: "",
    sale_price: "",
    description: ""
  });
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/products?limit=100")
      .then(res => setProducts(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Xử lý upload ảnh
  const handleImageChange = e => {
    setImageFile(e.target.files[0]);
  };

  const handleUploadImage = async () => {
    if (!imageFile) return;
    const data = new FormData();
    data.append("file", imageFile);
    const res = await axios.post("http://localhost:8000/products/upload-image/", data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    setForm({ ...form, image: `uploads/${res.data.filename}` });
    setImageFile(null);
  };

  const handleAdd = () => {
    axios.post("http://localhost:8000/products/", {
      ...form,
      price: Number(form.price),
      rating: form.rating ? Number(form.rating) : undefined,
      stock: form.stock ? Number(form.stock) : undefined,
      sale_price: form.sale_price ? Number(form.sale_price) : undefined,
    }).then(res => {
      setProducts([...products, res.data]);
      setForm({
        name: "", brand: "", price: "", image: "", rating: "", stock: "", sale_price: "", description: ""
      });
    });
  };

  const handleDelete = id => {
    axios.delete(`http://localhost:8000/products/${id}`)
      .then(() => setProducts(products.filter(p => p.id !== id)));
  };

  const handleEdit = p => {
    setEditId(p.id);
    setForm({
      name: p.name || "",
      brand: p.brand || "",
      price: p.price || "",
      image: p.image || "",
      rating: p.rating || "",
      stock: p.stock || "",
      sale_price: p.sale_price || "",
      description: p.description || ""
    });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:8000/products/${editId}`, {
      ...form,
      price: Number(form.price),
      rating: form.rating ? Number(form.rating) : undefined,
      stock: form.stock ? Number(form.stock) : undefined,
      sale_price: form.sale_price ? Number(form.sale_price) : undefined,
    }).then(res => {
      setProducts(products.map(p => p.id === editId ? res.data : p));
      setEditId(null);
      setForm({
        name: "", brand: "", price: "", image: "", rating: "", stock: "", sale_price: "", description: ""
      });
    });
  };

  return (
    <div>
      <h2>Quản lý sản phẩm</h2>
      <div>
        <input name="name" placeholder="Tên" value={form.name} onChange={handleChange} />
        <input name="brand" placeholder="Hãng" value={form.brand} onChange={handleChange} />
        <input name="price" placeholder="Giá" value={form.price} onChange={handleChange} />
        <input name="rating" placeholder="Đánh giá" value={form.rating} onChange={handleChange} />
        <input name="stock" placeholder="Tồn kho" value={form.stock} onChange={handleChange} />
        <input name="sale_price" placeholder="Giá sale" value={form.sale_price} onChange={handleChange} />
        <input name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} />

        {/* Upload ảnh */}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="button" onClick={handleUploadImage}>Tải ảnh lên</button>
        <input name="image" placeholder="Đường dẫn ảnh" value={form.image} onChange={handleChange} />

        {editId ? (
          <button onClick={handleUpdate}>Lưu</button>
        ) : (
          <button onClick={handleAdd}>Thêm sản phẩm</button>
        )}
        {editId && <button onClick={() => { setEditId(null); setForm({ name: "", brand: "", price: "", image: "", rating: "", stock: "", sale_price: "", description: "" }); }}>Hủy</button>}
      </div>
      <table border="1" cellPadding={8} style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Hãng</th>
            <th>Giá</th>
            <th>Giá sale</th>
            <th>Ảnh</th>
            <th>Đánh giá</th>
            <th>Tồn kho</th>
            <th>Mô tả</th>
            <th>Sửa</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.brand}</td>
              <td>{p.price}</td>
              <td>{p.sale_price}</td>
              <td><img src={`http://localhost:8000/${p.image}`} alt={p.name} width={60} /></td>
              <td>{p.rating}</td>
              <td>{p.stock}</td>
              <td>{p.description}</td>
              <td><button onClick={() => handleEdit(p)}>Sửa</button></td>
              <td><button onClick={() => handleDelete(p.id)}>Xóa</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}