import { useEffect, useRef, } from 'react';

export const useIdleTimer = (timeout = 180000, onIdle: () => void, isInitiate = false, preventReset = false) => {
    const timerRef = useRef<number | null>(null);

    const resetTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(onIdle, timeout);
    };

    useEffect(() => {
        if (!isInitiate) return
        const events = ['mousemove', 'keydown', 'scroll', 'touchstart'];

        const handleActivity = () => {
            if (preventReset) return;
            resetTimer();
        };

        events.forEach(event =>
            window.addEventListener(event, handleActivity)
        );

        resetTimer(); // start timer on mount

        return () => {
            events.forEach(event =>
                window.removeEventListener(event, handleActivity)
            );
            timerRef.current && clearTimeout(timerRef.current);
        };
    }, [timeout, onIdle, isInitiate, preventReset]);
};
