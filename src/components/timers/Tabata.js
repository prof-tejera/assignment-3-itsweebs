import { useState, useEffect } from "react";
import Panel from "../generic/Panel/Panel.js";
import Input from "../generic/Input/Input.js";
import Button from "../generic/Button/Button.js";
import DisplayTime from "../generic/DisplayTime/DisplayTime.js";
import DisplayText from "../generic/DisplayText/DisplayText.js";
import { formatTime } from "../../utils/helpers.js";
import { faPlay, faPause, faRedo, faForward, faStepForward } from '@fortawesome/free-solid-svg-icons';
import useTimeInput from "../../hooks/useTimeInput";
import useRoundsInput from "../../hooks/useRoundsInput";


const Tabata = () => {
    //define default values
    const defaultRounds = 8;

    //using the custom hook for handling time inputs
    const { inputMinutes: workMinutes, inputSeconds: workSeconds, calculatedTime: workTime, handleMinutesChange: handleWorkMinutesChange, handleSecondsChange: handleWorkSecondsChange } = useTimeInput('01', '30');
    const { inputMinutes: restMinutes, inputSeconds: restSeconds, calculatedTime: restTime, handleMinutesChange: handleRestMinutesChange, handleSecondsChange: handleRestSecondsChange } = useTimeInput('00', '20');
    //using the custom hook for handling rounds input
    const { rounds, handleRoundsChange } = useRoundsInput('8');
    //state to keep track of the current round
    const [currentRound, setCurrentRound] = useState(1);
    //state to determine if the timer is running
    const [isRunning, setIsRunning] = useState(false);
    //state to track whether it is work or rest time
    const [isWorkTime, setIsWorkTime] = useState(true);
    //state to keep track of the remaining time in the current interval
    const [remainingTime, setRemainingTime] = useState(workTime);

    //handle timer logic
    useEffect(() => {
        let interval;

        //if the timer is running and there's still time left, decrease time by 1 every second
        if (isRunning && remainingTime > 0) {
            interval = setInterval(() => setRemainingTime(prevTime => prevTime - 1), 1000);
        }
        //if time runs out and there are more rounds to go, switch between work and rest times
        else if (isRunning && remainingTime === 0 && currentRound < parseInt(rounds, 10)) {
            setIsWorkTime(!isWorkTime);
            setRemainingTime(isWorkTime ? restTime : workTime);
            if (!isWorkTime) {
                setCurrentRound((prevRound) => prevRound + 1);
            }
        }
        //if time runs out and all rounds are done, stop the timer
        else if (remainingTime === 0 && currentRound === parseInt(rounds, 10)) {
            setIsRunning(false);
        }

        //clear the timer when the component unmounts or values change
        return () => clearInterval(interval);
    }, [isRunning, remainingTime, currentRound, rounds, workTime, restTime, isWorkTime]);


    //function to start or pause the timer
    const startPauseTimer = () => {
        setIsRunning(!isRunning);
    };

    //function to reset the timer
    const resetTimer = () => {
        setIsRunning(false);
        setRemainingTime(workTime);
        setCurrentRound(1);
        setIsWorkTime(true);
    };

    //function to fast forward to the end of the current interval
    const fastForwardTimer = () => {
        setRemainingTime(0);
        if (isWorkTime && currentRound === parseInt(rounds, 10)) {
            setIsRunning(false);
        }
    };

    //function to end the timer
    const endTimer = () => {
        setIsRunning(false);
        setRemainingTime(0);
        setCurrentRound(parseInt(rounds, 10) || defaultRounds);
        setIsWorkTime(false);
    };

    // Render timer and control buttons
    return (
        <div>
            <Panel>
                Set Work Time:
                <div className="input-container">
                    <Input type="number" label="m&nbsp;" value={workMinutes} onChange={handleWorkMinutesChange} />
                    <Input type="number" label="s" value={workSeconds} onChange={handleWorkSecondsChange} />
                </div>
                Set Rest Time:
                <div className="input-container">
                    <Input type="number" label="m&nbsp;" value={restMinutes} onChange={handleRestMinutesChange} />
                    <Input type="number" label="s" value={restSeconds} onChange={handleRestSecondsChange} />
                </div>
                Set Rounds:
                <Input type="number" value={rounds} onChange={handleRoundsChange} />
            </Panel>
            <DisplayTime className={!isRunning && remainingTime === 0 && currentRound === parseInt(rounds, 10) && !isWorkTime ? 'time-finished' : ''}>
                {formatTime(remainingTime)}
            </DisplayTime>
            <DisplayText className="additional-text" text={!isRunning && remainingTime === 0 ? `Done!` : isWorkTime ? `Round ${currentRound} of ${rounds}` : "Rest"} />            
            <Panel className="control-panel">
                <div className="start-button-container">
                    <Button className="button-start" label={isRunning ? "Pause" : "Start"} icon={isRunning ? faPause : faPlay} onClick={startPauseTimer} />
                </div>
                <div className="buttons-container">
                    <Button className="button-reset" label="Reset" icon={faRedo} onClick={resetTimer} />
                    <Button className="button-forward" label="Forward" icon={faForward} onClick={fastForwardTimer} />
                    <Button className="button-end" label="End" icon={faStepForward} onClick={endTimer} />
                </div>
            </Panel>
        </div>
    );
};

export default Tabata;
