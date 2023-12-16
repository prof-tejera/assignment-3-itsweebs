import React from 'react';
import "./Button.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = ({ label, icon, onClick, ...props }) => {
  return (
    <button className={`button ${props.className}`} onClick={onClick}>
      {icon ? <FontAwesomeIcon icon={icon} aria-label={label} /> : label}
    </button>
  );
};

export default Button;