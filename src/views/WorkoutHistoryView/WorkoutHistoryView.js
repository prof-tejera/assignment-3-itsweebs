import React from 'react';
import Panel from '../../components/generic/Panel/Panel';
import './WorkoutHistoryView.css';

const WorkoutHistoryView = () => {
  const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory')) || [];

  const formatTimerDetails = (timer) => {
    if (timer.type === 'Tabata') {
      return `Work: ${timer.workMinutes}:${timer.workSeconds.padStart(2, '0')}, Rest: ${timer.restMinutes}:${timer.restSeconds.padStart(2, '0')}, Rounds: ${timer.rounds}`;
    } else {
      return `${timer.minutes}:${timer.seconds.toString().padStart(2, '0')} for ${timer.rounds} rounds`;
    }
  };

  return (
    <Panel>
      <h2>Workout History</h2>
      {workoutHistory.length === 0 ? (
        <p>No workouts completed yet.</p>
      ) : (
        workoutHistory.map((workout, index) => (
          <div className="history" key={index}>
            <h3>Workout on {new Date(workout.date).toLocaleString()}</h3>
            <ul>
              {workout.timers.map((timer, timerIndex) => (
                <li key={timerIndex}>
                  {timer.type} - {formatTimerDetails(timer)}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </Panel>
  );
};

export default WorkoutHistoryView;