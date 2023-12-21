import React from 'react';
import "./DisplayText.css";

const DisplayText = ({ text, className }) => {
  return (
    <div className={className}>
      {text}
    </div>
  );
};

export default DisplayText;