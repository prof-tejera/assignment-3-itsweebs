import React from 'react';
import "./Input.css";

const Input = ({ label, type = "text", ...props }) => {
  return (
    <div className="input-container">
      <label className="input-label">{label}</label>
      <input className="input-field" type={type} {...props} />
    </div>
  );
};

export default Input;