//format time in minutes and seconds
export const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

//calculate the time for an individual timer
export const calculateTimerTime = (timer) => {
    let timerTime = 0;
    switch (timer.type) {
        case 'Countdown':
        case 'Stopwatch':
            timerTime = parseInt(timer.minutes, 10) * 60 + parseInt(timer.seconds, 10);
            break;
        case 'XY':
            timerTime = (parseInt(timer.minutes, 10) * 60 + parseInt(timer.seconds, 10)) * parseInt(timer.rounds, 10);
            break;
        case 'Tabata':
            const workTime = parseInt(timer.workMinutes, 10) * 60 + parseInt(timer.workSeconds, 10);
            const restTime = parseInt(timer.restMinutes, 10) * 60 + parseInt(timer.restSeconds, 10);
            timerTime = (workTime + restTime) * parseInt(timer.rounds, 10);
            break;
        default:
            break;
    }
    return timerTime;
};


//calculate the total time for all timers in the list
export const calculateRemainingTime = (timers) => {
    return timers.reduce((totalTime, timer) => totalTime + timer.remainingTime, 0);
};
