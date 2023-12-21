import { createContext, useReducer, useEffect } from 'react';
import { calculateTimerTime } from '../utils/helpers';

const TimerContext = createContext();

const initialState = {
    timers: [], //store the added timers in an array
    currentTimerIndex: 0,
    isWorkoutRunning: false,
    isWorkoutComplete: false, //added to track if the workout is complete
    nextTimerId: 0,
    totalWorkoutTime: 0, //track the total time for all timers
};

const timerReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TIMER': { //add new timer at the end of the timers array
            const newTimer = {
                ...action.payload,
                id: state.nextTimerId, //assign a unique id to the new timer added
                remainingTime: calculateTimerTime(action.payload), //initialize remaining time for the timer
                isActive: false, //flag to indicate if timer is currently active
                description: action.payload.description || '' //ensure description is included
            };
            const newTimers = [...state.timers, newTimer];
            return {
                ...state,
                timers: newTimers,
                nextTimerId: state.nextTimerId + 1, //increment the id counter
                totalWorkoutTime: newTimers.reduce((total, timer) => total + calculateTimerTime(timer), 0) //update total workout time
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
            const updatedState = {
                ...state,
                isWorkoutRunning: !state.isWorkoutRunning,
            };
            saveStateToLocalStorage(updatedState);
            return updatedState;
        }
        case 'RESET_WORKOUT': { //reset workout to initial state
            //reset the individual timers' remaining times
            const resetTimers = state.timers.map(timer => ({
                ...timer,
                remainingTime: calculateTimerTime(timer),
            }));
            const updatedState = {
                ...state,
                currentTimerIndex: 0,
                isWorkoutRunning: false,
                isWorkoutComplete: false,
                timers: resetTimers,
            };
            saveStateToLocalStorage(updatedState);
            return updatedState;
        }
        case 'NEXT_TIMER': { //move to the next timer in sequence
            if (state.currentTimerIndex < state.timers.length - 1) {
                return {
                    ...state,
                    currentTimerIndex: state.currentTimerIndex + 1,
                };
            }
            const updatedState = {
                ...state,
                isWorkoutComplete: true, //mark workout as complete if timer last in queue
            };
            saveStateToLocalStorage(updatedState);
            return updatedState;
        }
        case 'END_WORKOUT': { //end the workout
            //reset the individual timers' remaining times
            const upatedTimers = state.timers.map(timer => ({
                ...timer,
                remainingTime: 0,
            }));
            const updatedState = {
                ...state,
                isWorkoutRunning: false,
                isWorkoutComplete: true,
                timers: upatedTimers
            };
            saveStateToLocalStorage(updatedState);
            return updatedState;
        }
        case 'UPDATE_TIMER': { //update an individual timer's remaining time
            const updatedTimers = state.timers.map(timer =>
                timer.id === action.payload.id ? { ...timer, remainingTime: action.payload.remainingTime } : timer
            );
            const updatedState = {
                ...state,
                timers: updatedTimers,
                totalWorkoutTime: calculateTimerTime(updatedTimers), //recalculate total workout time
            };
            saveStateToLocalStorage(updatedState);
            return updatedState;
        }
        case 'SET_TIMERS': { //set the timers from loaded configuration
            const newTimers = action.payload.map(timer => ({
                ...timer,
                remainingTime: calculateTimerTime(timer), //calculate remaining time for each timer
                description: timer.description || '', //ensure description is included
                isActive: false //ensure timers are not active
            }));
            const updatedState = {
                ...state,
                timers: newTimers,
                totalWorkoutTime: newTimers.reduce((total, timer) => total + calculateTimerTime(timer), 0) //recalculate total workout time
            }
            saveStateToLocalStorage(updatedState);
            return updatedState;
        }
        case 'REORDER_TIMER': { //change the order of a timer
            const { startIndex, endIndex } = action.payload;
            const reorderedTimers = [...state.timers];
            const [removedTimer] = reorderedTimers.splice(startIndex, 1);
            reorderedTimers.splice(endIndex, 0, removedTimer);
            const updatedState = {
                ...state,
                timers: reorderedTimers,
                currentTimerIndex: endIndex, //update the timer index accordingly
            };
            saveStateToLocalStorage(updatedState);
            return updatedState;
        }
        default:
            return state;
    }
};

const saveStateToLocalStorage = (state) => {
    localStorage.setItem('timerAppState', JSON.stringify(state));
};

const loadStateFromLocalStorage = () => {
    const savedState = localStorage.getItem('timerAppState');
    return savedState ? JSON.parse(savedState) : initialState;
};

export const TimerProvider = ({ children }) => {
    const [state, dispatch] = useReducer(timerReducer, initialState, loadStateFromLocalStorage);

    useEffect(() => {
        saveStateToLocalStorage(state);
    }, [state]);

    return (
        <TimerContext.Provider value={{ state, dispatch }}>
            {children}
        </TimerContext.Provider>
    );
};

export default TimerContext;