import React from 'react';
import Panel from '../../components/generic/Panel/Panel';

const WorkoutHistoryView = () => {
  const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory')) || [];

  return (
    <Panel>
      <h2>Workout History</h2>
      {workoutHistory.length === 0 ? (
        <p>No workouts completed yet</p>
      ) : (
        workoutHistory.map((workout, index) => (
          <div key={index}>
            <h3>Workout on {new Date(workout.date).toLocaleString()}</h3>
            <ul>
              {workout.timers.map((timer, timerIndex) => (
                <li key={timerIndex}>
                  {timer.type} - {timer.minutes}:{timer.seconds} for {timer.rounds} rounds
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