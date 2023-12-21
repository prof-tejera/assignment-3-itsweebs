import { useState } from 'react';

const useTimeInput = (initialMinutes = '00', initialSeconds = '00') => {
    const [inputMinutes, setInputMinutes] = useState(initialMinutes);
    const [inputSeconds, setInputSeconds] = useState(initialSeconds);

    const calculateTime = () => (
        (parseInt(inputMinutes, 10) || 0) * 60 + (parseInt(inputSeconds, 10) || 0)
    );
    const [calculatedTime, setCalculatedTime] = useState(calculateTime);
    const formatTimeInput = (value) => {
        if (value === '') {
            return '00';
            }
            return value.replace(/[^0-9]/g, '').slice(0, 2);
    };

    const handleMinutesChange = (e) => {
        const newMinutes = formatTimeInput(e.target.value);
        setInputMinutes(newMinutes);
        setCalculatedTime((parseInt(newMinutes, 10) || 0) * 60 + (parseInt(inputSeconds, 10) || 0));
    };

    const handleSecondsChange = (e) => {
        const newSeconds = formatTimeInput(e.target.value);
        setInputSeconds(newSeconds);
        setCalculatedTime((parseInt(inputMinutes, 10) || 0) * 60 + (parseInt(newSeconds, 10) || 0));
    };

    const setInitialTime = () => {
        setInputMinutes(initialMinutes);
        setInputSeconds(initialSeconds);
        setCalculatedTime((parseInt(inputMinutes, 10) || 0) * 60 + (parseInt(initialSeconds, 10) || 0));
    }

    return { inputMinutes, inputSeconds, calculatedTime, handleMinutesChange, handleSecondsChange, setInitialTime };
};

export default useTimeInput;