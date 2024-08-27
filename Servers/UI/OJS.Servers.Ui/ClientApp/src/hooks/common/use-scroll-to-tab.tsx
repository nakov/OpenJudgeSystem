import { useEffect, useMemo, useState } from 'react';

interface IUseScrollToTabParams<T> {
    hash: string;
    tabName: T;
    setTabName: (newTabName: T) => void;
    tabNames: T[];
}

/*
    This function is used to make the scroll smoother and slower,
    we can scroll for a custom duration, which improves UX.
 */
const smoothScroll = (element: HTMLElement, duration: number) => {
    const startPosition = window.scrollY;
    const targetPosition = element.getBoundingClientRect().top + startPosition;
    const startTime = performance.now();

    const easeInOutQuad = (currentTime: number, startValue: number, changeInValue: number, currentDuration: number) => {
        // Normalize the current time to a range of 0 to 2
        let time = currentTime / (currentDuration / 2);

        if (time < 1) {
            // First half of the animation: accelerating
            return (changeInValue / 2) * (time * time) + startValue;
        }

        // Second half of the animation: decelerating
        time -= 1;
        return (-changeInValue / 2) * (time * (time - 2) - 1) + startValue;
    };

    const scroll = () => {
        const currentTime = performance.now();
        const timeElapsed = currentTime - startTime;
        const nextScrollPosition = easeInOutQuad(timeElapsed, startPosition, targetPosition, duration);

        window.scrollTo(0, nextScrollPosition);

        if (timeElapsed < duration) {
            requestAnimationFrame(scroll);
        } else {
            window.scrollTo(0, targetPosition);
        }
    };

    scroll();
};

const useScrollToTab = <T extends string>({ hash, tabName, setTabName, tabNames }: IUseScrollToTabParams<T>) => {
    const [ hasScrolled, setHasScrolled ] = useState(false);
    const targetTab = tabNames.find((t) => t.toLowerCase() === hash.replace('#', '').toLowerCase());
    const shouldScroll = useMemo(
        () => (!hasScrolled && hash) && targetTab,
        [ hasScrolled, hash, targetTab ],
    );

    useEffect(() => {
        if (shouldScroll) {
            setTabName(targetTab!);
        }
    }, [ setTabName, shouldScroll, targetTab ]);

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (shouldScroll) {
            /*
                We use a MutationObserver to monitor the DOM and detect when the
                target tab element has been added to the DOM. Once the element is found,
                the observer triggers a smooth scroll to bring the element into view.
            */
            const observer = new MutationObserver(() => {
                const element = document.getElementById(tabName);
                if (element) {
                    /*
                       We use a small delay (50ms) to ensure the UI has finished loading
                       before scrolling, which improves the user experience.
                    */
                    setTimeout(() => {
                        smoothScroll(element, 2000);
                        setHasScrolled(true);
                        observer.disconnect();
                    }, 50);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });

            return () => observer.disconnect();
        }
    }, [ tabName, shouldScroll ]);
};

export default useScrollToTab;
