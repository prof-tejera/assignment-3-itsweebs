import { useState } from 'react';

const useRoundsInput = (defaultRounds = '10') => {
    const [rounds, setRounds] = useState(defaultRounds);

    const handleRoundsChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        setRounds(value);
    };

    const setInitialRounds = () => {
        setRounds(defaultRounds);
    }

    return { rounds, handleRoundsChange, setInitialRounds };
};

export default useRoundsInput;
