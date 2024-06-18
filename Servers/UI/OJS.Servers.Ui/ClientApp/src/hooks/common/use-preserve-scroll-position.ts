import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePreserveScrollPosition = (key = 'scrollPosition') => {
    const location = useLocation();
    const currentPathname = location.pathname;

    const saveScrollPosition = useCallback(() => {
        sessionStorage.setItem(key, window.scrollY.toString());
    }, [ key ]);

    // Wrapping this in useCallback breaks solution
    // as 'key' is needed to be dependency and it changes frequently
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const restoreScrollPosition = () => {
        const savedPosition = sessionStorage.getItem(key);
        if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition, 10));
        }
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            saveScrollPosition();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [ key, saveScrollPosition ]);

    useEffect(() => {
        restoreScrollPosition();
    }, [ key, restoreScrollPosition ]);

    // Reset scroll position on URL change
    useEffect(() => {
        sessionStorage.setItem(key, '0');
    }, [ currentPathname, key ]);

    return saveScrollPosition;
};

export default usePreserveScrollPosition;
