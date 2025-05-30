import React from 'react';
import { Link } from 'react-router-dom';
import Input from '../common/Input';

const Header = () => {
  return (
    <div style={{ 
      background: "#FFD600", 
      padding: 16, 
      display: "flex", 
      alignItems: "center",
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Link 
        to="/" 
        style={{ 
          marginRight: 32, 
          fontWeight: "bold", 
          fontSize: 24, 
          color: "#000", 
          textDecoration: "none",
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span role="img" aria-label="logo">📱</span>
        thegioididong
      </Link>

      <Input
        placeholder="Bạn tìm gì..."
        style={{
          width: 400,
          height: 36,
          marginLeft: 32,
          backgroundColor: 'white'
        }}
      />

      <div style={{ flex: 1 }}></div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link 
          to="/login" 
          style={{ 
            fontSize: 18,
            color: '#000',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span role="img" aria-label="login">👤</span>
          Đăng nhập
        </Link>

        <Link 
          to="/cart" 
          style={{ 
            fontSize: 18,
            color: '#000',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span role="img" aria-label="cart">🛒</span>
          Giỏ hàng
        </Link>

        <Link 
          to="/order-history" 
          style={{ 
            fontSize: 18,
            color: '#000',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span role="img" aria-label="orders">📜</span>
          Đơn hàng
        </Link>

        <Link 
          to="/chatbot" 
          style={{ 
            fontSize: 18,
            color: '#000',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span role="img" aria-label="chatbot">🤖</span>
          Chatbot
        </Link>

        <div style={{ 
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span role="img" aria-label="location">📍</span>
          Hồ Chí Minh
        </div>
      </nav>
    </div>
  );
};

export default Header; 