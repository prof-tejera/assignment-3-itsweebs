import { createContext, useReducer } from 'react';
import { calculateTimerTime } from '../utils/helpers';

const TimerContext = createContext();

const initialState = {
    timers: [], //store the added timers in an array
    currentTimerIndex: 0,
    isWorkoutRunning: false,
    isWorkoutComplete: false, //added to track if the workout is complete
    nextTimerId: 0,
    totalWorkoutTime: 0, // track the total time for all timers
};

const timerReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TIMER': { //add new timer at the end of the timers array
            const newTimer = {
                ...action.payload,
                id: state.nextTimerId, //assign a unique id to the new timer added
                remainingTime: calculateTimerTime(action.payload), //initialize remaining time for the timer
                isActive: false //flag to indicate if timer is currently active
            };
            const newTimers = [...state.timers, newTimer];
            return {
                ...state,
                timers: newTimers,
                nextTimerId: state.nextTimerId + 1, //increment the id counter
                totalWorkoutTime: calculateTimerTime(newTimers), //update total workout time
            };
        }
        case 'REMOVE_TIMER': { //remove a timer by its id
            const updatedTimers = state.timers.filter(timer => timer.id !== action.payload);
            return {
                ...state,
                timers: updatedTimers,
                totalWorkoutTime: calculateTimerTime(updatedTimers), //recalculate total workout time
            };
        }
        case 'TOGGLE_WORKOUT': { //toggle between starting/resuming and pausing a workout
            return {
                ...state,
                isWorkoutRunning: !state.isWorkoutRunning,
            };
        }
        case 'RESET_WORKOUT': { //reset workout to initial state
            return {
                ...state,
                currentTimerIndex: 0,
                isWorkoutRunning: false,
                isWorkoutComplete: false,
            };
        }
        case 'NEXT_TIMER': { //move to the next timer in sequence
            if (state.currentTimerIndex < state.timers.length - 1) {
                return {
                    ...state,
                    currentTimerIndex: state.currentTimerIndex + 1,
                };
            }
            return {
                ...state,
                isWorkoutComplete: true, //mark workout as complete if timer last in queue
            };
        }
        case 'END_WORKOUT': { //end the workout
            return {
                ...state,
                isWorkoutRunning: false,
                isWorkoutComplete: true,
            };
        }
        case 'UPDATE_TIMER': { //update an individual timer's remaining time
            const updatedTimers = state.timers.map(timer =>
                timer.id === action.payload.id ? { ...timer, remainingTime: action.payload.remainingTime } : timer
            );
            return {
                ...state,
                timers: updatedTimers,
                totalWorkoutTime: calculateTimerTime(updatedTimers), //recalculate total workout time
            };
        }
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
