import { useEffect, useMemo, useState } from 'react';

interface IUseScrollToTabParams<T> {
    hash: string;
    tabName: T;
    setTabName: (newTabName: T) => void;
    tabNames: T[];
}

const isElementInViewport = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

const useScrollToTab = <T extends string>({ hash, tabName, setTabName, tabNames }: IUseScrollToTabParams<T>) => {
    const [ hasScrolled, setHasScrolled ] = useState(false);
    /*
        Every fragment MUST be prefixed with 'tab-', otherwise the browser will register
        as a 'hashchange' event and will navigate directly to the element with the corresponding id.
     */
    const targetTab = tabNames.find((t) => t.toLowerCase() === hash.replace('#tab-', '').toLowerCase());

    const shouldScroll = useMemo(() => !hasScrolled && hash && targetTab !== null && targetTab !== '', [ hasScrolled, hash, targetTab ]);

    useEffect(() => {
        if (shouldScroll) {
            setTabName(targetTab!);
        }
    }, [ setTabName, shouldScroll, targetTab ]);

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (shouldScroll) {
            const scrollToElement = () => {
                const element = document.getElementById(tabName);

                if (element) {
                    const isElementVisible = isElementInViewport(element);
                    if (!isElementVisible) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                        setHasScrolled(true);
                    }
                }
            };

            // Initial check if the element is already in the DOM
            scrollToElement();

            // Set up MutationObserver to handle cases where the element is not yet in the DOM
            const observer = new MutationObserver(() => {
                scrollToElement(); // Call scrollToElement when mutations are detected
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
