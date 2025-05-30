import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  style = {} 
}) => {
  const baseStyle = {
    padding: '12px 24px',
    backgroundColor: disabled ? '#b3b3b3' : variant === 'primary' ? '#007bff' : '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '1.1em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100px',
    ...style
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={baseStyle}
    >
      {children}
    </button>
  );
};

export default Button; 