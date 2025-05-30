import React from 'react';

const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  style = {}
}) => {
  const baseStyle = {
    flex: 1,
    padding: '12px 20px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1.1em',
    transition: 'border-color 0.3s ease',
    outline: 'none',
    backgroundColor: disabled ? '#f5f5f5' : 'white',
    ...style
  };

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={baseStyle}
    />
  );
};

export default Input; 