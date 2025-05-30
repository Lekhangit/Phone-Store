import React, { useState } from "react";
import { login, register } from '../../services/authService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function Login() {
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await login(username, password);
      localStorage.setItem("user_id", data.id);
      alert("Đăng nhập thành công!");
    } catch (error) {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  const handleRegister = async () => {
    try {
      await register(username, password);
      alert("Đăng ký thành công! Hãy đăng nhập.");
    } catch (error) {
      alert("Đăng ký thất bại!");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Button 
          onClick={() => setTab("login")}
          variant={tab === "login" ? "primary" : "secondary"}
        >
          Đăng nhập
        </Button>
        <Button 
          onClick={() => setTab("register")}
          variant={tab === "register" ? "primary" : "secondary"}
        >
          Đăng ký
        </Button>
      </div>

      {tab === "login" ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Input
            placeholder="Tên đăng nhập"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button onClick={handleLogin}>Đăng nhập</Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Input
            placeholder="Tên đăng ký"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Mật khẩu đăng ký"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button onClick={handleRegister}>Đăng ký</Button>
        </div>
      )}
    </div>
  );
} 