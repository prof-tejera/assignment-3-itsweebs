import React from 'react';
import "./DisplayTime.css";

const DisplayTime = ({ children, className }) => {
  const combinedClassName = `displayTime ${className || ''}`;
  return <div className={combinedClassName}>{children}</div>;
};

export default DisplayTime;
