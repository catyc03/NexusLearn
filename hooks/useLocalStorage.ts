import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const { currentUser } = useAuth();

    const getInitialValue = () => {
        if (typeof window === 'undefined' || !currentUser) {
            return initialValue;
        }
        try {
            const userKey = `${key}_${currentUser.email}`;
            const item = window.localStorage.getItem(userKey);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    };

    const [storedValue, setStoredValue] = useState<T>(getInitialValue);

    useEffect(() => {
        // This effect ensures that if the user logs in/out, the state is re-initialized.
        setStoredValue(getInitialValue());
    }, [currentUser, key]);

    useEffect(() => {
        if (!currentUser) return;
        try {
            const userKey = `${key}_${currentUser.email}`;
            const valueToStore = typeof storedValue === 'function' ? storedValue(storedValue) : storedValue;
            window.localStorage.setItem(userKey, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    }, [key, storedValue, currentUser]);

    return [storedValue, setStoredValue];
}

export default useLocalStorage;