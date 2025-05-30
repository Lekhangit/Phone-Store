import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [password, setPassword] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/user?limit=100")
      .then(res => setUsers(res.data));
  }, []);

  const handleEdit = (user) => {
    setEditId(user.id);
    setPassword(""); // Không hiển thị password cũ
  };

  const handleUpdate = (id) => {
    axios.put(`http://localhost:8000/user/${id}`, { password })
      .then(res => {
        setUsers(users.map(u => u.id === id ? res.data : u));
        setEditId(null);
        setPassword("");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa user này?")) return;
    axios.delete(`http://localhost:8000/user/${id}`)
      .then(() => setUsers(users.filter(u => u.id !== id)));
  };

  return (
    <div>
      <h2>Quản lý người dùng</h2>
      <table border="1" cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên đăng nhập</th>
            <th>Mật khẩu</th>
            <th>Sửa Mật khẩu</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>
                {editId === u.id ? (
                  <input
                    type="text"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                  />
                ) : (
                  "******"
                )}
              </td>
              <td>
                {editId === u.id ? (
                  <>
                    <button onClick={() => handleUpdate(u.id)}>Lưu</button>
                    <button onClick={() => { setEditId(null); setPassword(""); }}>Hủy</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(u)}>Sửa</button>
                )}
              </td>
              <td>
                <button onClick={() => handleDelete(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}