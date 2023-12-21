import React from "react";
import "./TimersView.css";

import Stopwatch from "../../components/timers/Stopwatch";
import Countdown from "../../components/timers/Countdown";
import XY from "../../components/timers/XY";
import Tabata from "../../components/timers/Tabata";

const TimersView = () => {
  const timers = [
    { title: "Stopwatch", C: <Stopwatch /> },
    { title: "Countdown", C: <Countdown /> },
    { title: "XY", C: <XY /> },
    { title: "Tabata", C: <Tabata /> },
  ];

  return (
    <div className="Timers">
      {timers.map((timer) => (
        <div key={`timer-${timer.title}`} className="Timer">
          <div className="TimerTitle">{timer.title}</div>
          {timer.C}
        </div>
      ))}
    </div>
  );
};

export default TimersView;