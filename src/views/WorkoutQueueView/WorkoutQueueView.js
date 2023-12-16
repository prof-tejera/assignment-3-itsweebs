import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TimerContext from '../../context/TimerContext';
import Panel from '../../components/generic/Panel/Panel';
import { formatTime, calculateRemainingTime } from '../../utils/helpers';
import DisplayTime from '../../components/generic/DisplayTime/DisplayTime';
import DisplayText from '../../components/generic/DisplayText/DisplayText';
import Button from '../../components/generic/Button/Button';
import { faPlay, faPause, faRedo, faStepForward, faStop, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './WorkoutQueueView.css'

const WorkoutQueueView = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(TimerContext);
  const [initialTotalTime, setInitialTotalTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  //calculate initial total workout time based on timers in the queue
  useEffect(() => {
    const total = calculateRemainingTime(state.timers);
    setInitialTotalTime(total);
    setRemainingTime(total);
  }, [state.timers]);

  //update remaining time when the current timer index changes
  useEffect(() => {
    const newRemainingTime = calculateRemainingTime(state.timers.slice(state.currentTimerIndex));
    setRemainingTime(newRemainingTime);
  }, [state.currentTimerIndex, state.timers]);

  //handle individual timer countdown
  useEffect(() => {
    let interval;
    if (state.isWorkoutRunning) {
      interval = setInterval(() => {
        const activeTimer = state.timers[state.currentTimerIndex];
        if (activeTimer && activeTimer.remainingTime > 0) {
          dispatch({
            type: 'UPDATE_TIMER',
            payload: { id: activeTimer.id, remainingTime: activeTimer.remainingTime - 1 }
          });
        } else if (activeTimer && activeTimer.remainingTime === 0) {
          //move to the next timer or end workout if it's the last timer
          if (state.currentTimerIndex < state.timers.length - 1) {
            dispatch({ type: 'NEXT_TIMER' });
          } else {
            dispatch({ type: 'END_WORKOUT' });
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isWorkoutRunning, state.currentTimerIndex, state.timers, dispatch]);

  //remove a timer from the workout queue
  const removeTimer = (id) => {
    dispatch({ type: 'REMOVE_TIMER', payload: id });
  };

  //global controls
  const handlePauseResume = () => {
    dispatch({ type: 'TOGGLE_WORKOUT' });
  };
  const handleReset = () => {
    dispatch({ type: 'RESET_WORKOUT' });
    setRemainingTime(initialTotalTime);
  };
  const handleFastForward = () => {
    dispatch({ type: 'NEXT_TIMER' });
  };
  const handleEndWorkout = () => {
    dispatch({ type: 'END_WORKOUT' });
    setRemainingTime(0);
  };

  //determine if the current timer is last in queue
  const isLastTimer = state.currentTimerIndex >= state.timers.length - 1;

  return (
    <div className="container">
      <div className="workout">
        <DisplayText className="workout-title" text="Workout" />
        <DisplayTime className={state.isWorkoutComplete ? 'time-finished' : ''}>
          {formatTime(remainingTime)}
        </DisplayTime>
        <DisplayText className="additional-text" text={!state.isWorkoutRunning && remainingTime === 0 && state.timers.length > 0 ? 'Done!' : ''} />
        <Panel className="control-panel">
          <div className="start-button-container">
            <Button
              className="button-start"
              label={state.isWorkoutRunning ? "Pause" : "Start"}
              icon={state.isWorkoutRunning ? faPause : faPlay}
              onClick={handlePauseResume}
              disabled={state.isWorkoutComplete}
            />
          </div>
          <div className="buttons-container">
            <Button
              className="button-reset"
              label="Reset"
              icon={faRedo}
              onClick={handleReset}
            />
            <Button
              className="button-forward"
              label="Forward"
              icon={faStepForward}
              onClick={handleFastForward}
              disabled={isLastTimer || state.isWorkoutComplete}
            />
            <Button
              className="button-end"
              label="End"
              icon={faStop}
              onClick={handleEndWorkout}
              disabled={state.isWorkoutComplete}
            />
          </div>
        </Panel>
      </div>
      <h2>Workout Queue</h2>
      {
        state.timers.map((timer, index) => (
          <div key={timer.id} className={`timer-item ${index === state.currentTimerIndex ? 'active-timer' : ''}`}>
            <div className="timer-info">
              <div className="timer-type">{timer.type}</div>
              <div className="timer-details">
                {timer.type !== 'Tabata' && (
                  <span>{timer.minutes}:{(timer.seconds ?? '0').toString().padStart(2, '0')}</span>
                )}
                {timer.type === 'Tabata' && (
                  <>
                    <span>Work: {timer.workMinutes}:{timer.workSeconds.padStart(2, '0')}</span>
                    <span>Rest: {timer.restMinutes}:{timer.restSeconds.padStart(2, '0')}</span>
                  </>
                )}
                {timer.rounds && <span>Rounds: {timer.rounds}</span>}
              </div>
            </div>
            <Button className="button-remove" icon={faTrashAlt} onClick={() => removeTimer(timer.id)} />
          </div>
        ))
      }
      <Button className="button-add-timer" label="Add Timer" onClick={() => navigate('/add')} />
    </div >
  );
};

export default WorkoutQueueView;