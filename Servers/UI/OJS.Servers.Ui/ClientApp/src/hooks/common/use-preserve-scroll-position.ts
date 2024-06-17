import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePreserveScrollPosition = (key = 'scrollPosition') => {
    const location = useLocation();
    const currentPathname = location.pathname;

    // Save scroll position before state change or navigation
    const saveScrollPosition = () => {
        sessionStorage.setItem(key, window.scrollY.toString());
    };

    // Restore scroll position after component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const restoreScrollPosition = () => {
        const savedPosition = sessionStorage.getItem(key);
        if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition, 10));
        }
    };

    // Save scroll position before navigation
    useEffect(() => {
        const handleBeforeUnload = () => {
            saveScrollPosition();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ key ]);

    // Restore scroll position on mount
    useEffect(() => {
        restoreScrollPosition();
    }, [ key, restoreScrollPosition ]);

    // Reset scroll position on URL change
    useEffect(() => {
        console.log(`location change ${currentPathname}`);
        sessionStorage.setItem(key, '0');
    }, [ currentPathname, key ]);

    return saveScrollPosition;
};

export default usePreserveScrollPosition;
