import React from 'react';
import './RadioButtons.css'

//render a group of radio buttons based on the timerList
const RadioButtons = ({ label, timerList, activeType, onChange }) => {
  return (
    <div className="radio-group">
      <span>{label}</span>
      {timerList.map((timer) => (
        <div key={timer} className="radio">
          <input
            type="radio"
            id={timer}
            name="timerRadio"
            checked={activeType === timer}
            onChange={() => onChange(timer)}
            className="radio-input"
          />
          <label htmlFor={timer} className="radio-label">{timer}</label>
        </div>
      ))}
    </div>
  );
};

export default RadioButtons;