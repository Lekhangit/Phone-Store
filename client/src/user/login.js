import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    axios.post("http://localhost:8000/user/login", { username, password })
      .then(res => {
        localStorage.setItem("user_id", res.data.id);
        alert("Đăng nhập thành công!");
      })
      .catch(() => alert("Sai tài khoản hoặc mật khẩu!"));
  };

  const handleRegister = () => {
    axios.post("http://localhost:8000/user/", { username, password })
      .then(() => alert("Đăng ký thành công! Hãy đăng nhập."))
      .catch(() => alert("Đăng ký thất bại!"));
  };

  return (
    <div>
      <button onClick={() => setTab("login")}>Đăng nhập</button>
      <button onClick={() => setTab("register")}>Đăng ký</button>
      {tab === "login" ? (
        <div>
          <input placeholder="Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} />
          <input placeholder="Mật khẩu" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Đăng nhập</button>
        </div>
      ) : (
        <div>
          <input placeholder="Tên đăng ký" value={username} onChange={e => setUsername(e.target.value)} />
          <input placeholder="Mật khẩu đăng ký" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={handleRegister}>Đăng ký</button>
        </div>
      )}
    </div>
  );
}