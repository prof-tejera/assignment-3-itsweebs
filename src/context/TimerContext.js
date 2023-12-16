import { createContext, useReducer } from 'react';
import { calculateTimerTime } from '../utils/helpers';

const TimerContext = createContext();

const initialState = {
    timers: [], //store the added timers in an array
    currentTimerIndex: 0,
    isWorkoutRunning: false,
    nextTimerId: 0,
};

const timerReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TIMER': //add new timer at end of timers array
            const newTimer = { ...action.payload, id: state.nextTimerId }; //assign a unique id to the new timer added
            return {
                ...state,
                timers: [...state.timers, newTimer],
                nextTimerId: state.nextTimerId + 1, //increment the id counter
            };
        case 'REMOVE_TIMER': //remove a timer by its id
            return {
                ...state,
                timers: state.timers.filter(timer => timer.id !== action.payload),
            };
        case 'TOGGLE_WORKOUT': //toggle between starting/resuming and pausing a workout
            return {
                ...state,
                isWorkoutRunning: !state.isWorkoutRunning,
            };
        case 'RESET_WORKOUT': //reset workout to initial state
            return {
                ...state,
                currentTimerIndex: 0,
                isWorkoutRunning: false,
                isWorkoutComplete: false,
            };
        case 'NEXT_TIMER': //move to the next timer in sequence and adjust workout time as needed, disable button if timer is last in sequence
        if (state.currentTimerIndex < state.timers.length - 1) {
            const currentTimerTime = calculateTimerTime(state.timers[state.currentTimerIndex]);
            const newRemainingTime = state.remainingTime - currentTimerTime;
            return {
              ...state,
              currentTimerIndex: state.currentTimerIndex + 1,
              remainingTime: newRemainingTime > 0 ? newRemainingTime : 0,
            };
          }
          return state;
        case 'END_WORKOUT': //end the workout
            return {
                ...state,
                isWorkoutRunning: false,
                isWorkoutComplete: true,
            };
        default:
            return state;
    }
};

export const TimerProvider = ({ children }) => {
    const [state, dispatch] = useReducer(timerReducer, initialState);

    return (
        <TimerContext.Provider value={{ state, dispatch }}>
            {children}
        </TimerContext.Provider>
    );
};

export default TimerContext;