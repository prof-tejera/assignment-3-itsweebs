import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TimerContext from '../../context/TimerContext';
import Panel from '../../components/generic/Panel/Panel';
import { formatTime, calculateRemainingTime, calculateTimerTime } from '../../utils/helpers';
import DisplayTime from '../../components/generic/DisplayTime/DisplayTime';
import DisplayText from '../../components/generic/DisplayText/DisplayText';
import Button from '../../components/generic/Button/Button';
import { faPlay, faPause, faRedo, faStepForward, faStop, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import './WorkoutQueueView.css';
import { useDrag, useDrop } from 'react-dnd';

const WorkoutQueueView = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(TimerContext);
  const [remainingTime, setRemainingTime] = useState(0);
  const [editingTimerId, setEditingTimerId] = useState(null);
  const [editTimerDetails, setEditTimerDetails] = useState({ minutes: 0, seconds: 0, type: '', rounds: 1 });

  //update remaining time when the current timer index changes
  useEffect(() => {
    const newRemainingTime = calculateRemainingTime(state.timers.slice(state.currentTimerIndex));
    setRemainingTime(newRemainingTime);
  }, [state.currentTimerIndex, state.timers]);

  //save timer configuration to URL
  const saveConfiguration = () => {
    const serializedTimers = encodeURIComponent(JSON.stringify(state.timers));
    window.history.pushState(null, null, `?config=${serializedTimers}`);
  };

  //load state from URL and local storage
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const config = queryParams.get('config');
    if (config) {
      try {
        const timers = JSON.parse(decodeURIComponent(config));
        dispatch({ type: 'SET_TIMERS', payload: timers });
      } catch (error) {
        console.error('Error parsing timers from URL', error);
      }
    }
    const savedState = localStorage.getItem('workoutState');
    if (savedState) {
      try {
        const restoredState = JSON.parse(savedState);
        dispatch({ type: 'RESTORE_STATE', payload: restoredState });
      } catch (error) {
        console.error('Error parsing state from local storage', error);
      }
    }
  }, [dispatch]);

  //start editing a timer
  const startEditing = (id) => {
    const timerToEdit = state.timers.find(timer => timer.id === id);
    setEditTimerDetails({ ...timerToEdit, description: timerToEdit.description });
    setEditingTimerId(id);
  };

  //save edited timer and update URL
  const saveEditedTimer = () => {
    const updatedTimers = state.timers.map(timer =>
      timer.id === editingTimerId ? { ...timer, ...editTimerDetails } : timer
    );
    dispatch({ type: 'SET_TIMERS', payload: updatedTimers });
    saveConfiguration();
    setEditingTimerId(null);
  };

  //exit edit mode without saving
  const cancelEditing = () => {
    setEditingTimerId(null);
  };

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
          //move to the next timer or end workout if it's the last timer
        } else if (activeTimer && activeTimer.remainingTime === 0) {
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
    const resetTimers = state.timers.map(timer => ({
      ...timer,
      remainingTime: calculateTimerTime(timer)
    }));
    dispatch({ type: 'SET_TIMERS', payload: resetTimers });
    dispatch({ type: 'RESET_WORKOUT' });
    setRemainingTime(state.totalWorkoutTime);
  };
  const handleFastForward = () => {
    if (state.currentTimerIndex < state.timers.length - 1) {
      dispatch({ type: 'NEXT_TIMER' });
    } else {
      dispatch({ type: 'END_WORKOUT' });
    }
  };
  const handleEndWorkout = () => {
    dispatch({ type: 'END_WORKOUT' });
    setRemainingTime(0);
  
    //save the workout to the history
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    const newWorkoutRecord = {
      date: new Date().toISOString(),
      timers: state.timers,
    };
    workoutHistory.push(newWorkoutRecord);
    localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
  };
  

  //determine if the current timer is last in queue
  const isLastTimer = state.currentTimerIndex >= state.timers.length - 1;

  //reorder functionality
  const DraggableTimer = ({ timer, id, index, editingTimerId, startEditing, removeTimer, state, dispatch }) => {
    const [, dragRef, preview] = useDrag({
      type: 'TIMER',
      item: () => ({ index }),
    });

    const [, dropRef] = useDrop({
      accept: 'TIMER',
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          dispatch({
            type: 'REORDER_TIMER',
            payload: {
              startIndex: draggedItem.index,
              endIndex: index,
            },
          });
        }
      },
    });

    const ref = (node) => dragRef(dropRef(node));

    return (
      <div ref={ref} className={`timer-item ${index === state.currentTimerIndex ? 'active-timer' : ''} ${preview.isDragging ? 'dragging' : ''}`}>
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
          {index === state.currentTimerIndex && (
            <div className="timer-description">{timer.description}</div>
          )}
        </div>
        {editingTimerId === timer.id ? (
          <div className="edit-form">
            <div className="labels">edit time:</div>
            <input type="number" value={editTimerDetails.minutes} onChange={(e) => setEditTimerDetails({ ...editTimerDetails, minutes: e.target.value })} /><span className="labels">:</span>
            <input type="number" value={editTimerDetails.seconds} onChange={(e) => setEditTimerDetails({ ...editTimerDetails, seconds: e.target.value })} /><br />
            <div className="labels">edit description:</div><input className="description-edit" type="text" value={editTimerDetails.description} onChange={(e) => setEditTimerDetails({ ...editTimerDetails, description: e.target.value })} /><br />
            <Button label="Save" className="edit-save" onClick={() => saveEditedTimer(timer.id)} />
            <Button label="Cancel" className="edit-cancel" onClick={cancelEditing} />
          </div>
        ) : (
          <div className="timer-controls">
            <Button className="button-remove" icon={faEdit} onClick={() => startEditing(timer.id)} />
            <Button className="button-remove" icon={faTrashAlt} onClick={() => removeTimer(timer.id)} />
          </div>
        )}
      </div>
    );
  };

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
          <DraggableTimer
            timer={timer}
            key={timer.id}
            index={index}
            id={timer.id}
            editingTimerId={editingTimerId}
            startEditing={startEditing}
            removeTimer={removeTimer}
            state={state}
            dispatch={dispatch}
          />
        ))
      }
      <Button className="button-add-timer" label="Add Timer" onClick={() => navigate('/add')} />
      <Button className="button-save" label="Save Configuration" onClick={saveConfiguration} />
    </div>
  );
};

export default WorkoutQueueView;