import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import TimerContext from '../../context/TimerContext';
import RadioButtons from '../../components/generic/RadioButtons/RadioButtons.js';
import Panel from '../../components/generic/Panel/Panel';
import Input from '../../components/generic/Input/Input';
import Button from '../../components/generic/Button/Button.js';
import useTimeInput from '../../hooks/useTimeInput';
import useRoundsInput from '../../hooks/useRoundsInput';
import "./AddTimersView.css"

const AddTimerView = () => {
  //using dispatch from TimerContext for state updates
  const { dispatch } = useContext(TimerContext);
  //state to track the selected timer type, defaulted to stopwatch
  const [activeType, setActiveType] = useState("Stopwatch");
  //utilizing custom hooks for handling input fields
  const { inputMinutes, inputSeconds, handleMinutesChange, handleSecondsChange } = useTimeInput('01', '30');
  //separate instance for handling rest time in Tabata timer
  const { inputMinutes: restMinutes, inputSeconds: restSeconds, handleMinutesChange: handleRestMinutesChange, handleSecondsChange: handleRestSecondsChange } = useTimeInput('00', '20');
  //utilizing custom hook for handling rounds input for Tabata and XY
  const { rounds, handleRoundsChange } = useRoundsInput('8');
  //add text to confirm when a timer is added and handle it clearing
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationTimeout, setConfirmationTimeout] = useState(null);
  //state for adding description
  const [description, setDescription] = useState('');

  //available timers
  const Timers = ["Stopwatch", "Countdown", "XY", "Tabata"];

  //handle timer type selection changes
  const handleTypeChange = (type) => {
    if (activeType !== type) {
      setShowConfirmation(false); //hide confirmation when timer type changes
    }
    setActiveType(type);
  };

  //add the configured timer to the global state
  const addTimer = () => {
    const timerConfig = {
      type: activeType,
      minutes: activeType === "Tabata" ? undefined : inputMinutes,
      seconds: activeType === "Tabata" ? undefined : inputSeconds,
      workMinutes: activeType === "Tabata" ? inputMinutes : undefined,
      workSeconds: activeType === "Tabata" ? inputSeconds : undefined,
      restMinutes: activeType === "Tabata" ? restMinutes : undefined,
      restSeconds: activeType === "Tabata" ? restSeconds : undefined,
      rounds: activeType === "Tabata" || activeType === "XY" ? rounds : undefined, description,
    };

    dispatch({ type: 'ADD_TIMER', payload: timerConfig });

    //show confirmation message
    setShowConfirmation(true);
    //clear any existing timeouts
    if (confirmationTimeout) {
      clearTimeout(confirmationTimeout);
    }
    //reset confirmation message after 3 seconds
    const timeout = setTimeout(() => setShowConfirmation(false), 3000);
    setConfirmationTimeout(timeout);
  };

  //flag to conditionally render Tabata-specific input fields
  const isTabata = activeType === "Tabata";

  //show rounds input if Tabata or XY are selected
  const showRoundsInput = activeType === "Tabata" || activeType === "XY";

  return (
    <Panel>
      <h2>Add Timer</h2>
      Select a timer:
      <RadioButtons timerList={Timers} activeType={activeType} onChange={handleTypeChange} />
      <div className="timer-container">
        <div className="Timer">
          <Panel>
            {isTabata && (
              <>
                Set Work Time:
                <div className="input-container">
                  <Input type="number" label="m" value={inputMinutes} onChange={handleMinutesChange} />
                  <Input type="number" label="s" value={inputSeconds} onChange={handleSecondsChange} />
                </div>
                Set Rest Time:
                <div className="input-container">
                  <Input type="number" label="m" value={restMinutes} onChange={handleRestMinutesChange} />
                  <Input type="number" label="s" value={restSeconds} onChange={handleRestSecondsChange} />
                </div>
              </>
            )}
            {!isTabata && (
              <>
                Set Time:
                <div className="input-container">
                  <Input type="number" label="m" value={inputMinutes} onChange={handleMinutesChange} />
                  <Input type="number" label="s" value={inputSeconds} onChange={handleSecondsChange} />
                </div>
              </>
            )}
            {showRoundsInput && (
              <>
                Set Rounds:
                <div className="input-container">
                  <Input type="number" label="Rounds" value={rounds} onChange={handleRoundsChange} />
                </div>
              </>
            )}
            Description:
            <div>
              <Input 
                type="text"  
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="input-description"
              />
            </div>
          </Panel>
        </div>
      </div>
      <Button className="button-add" label="Add" onClick={addTimer} /><br />
      {showConfirmation && <div className="confirmation">Timer Added!</div>}
      <Link to="/" className="home-link">Back to Workout</Link>
    </Panel>
  );
};

export default AddTimerView;
