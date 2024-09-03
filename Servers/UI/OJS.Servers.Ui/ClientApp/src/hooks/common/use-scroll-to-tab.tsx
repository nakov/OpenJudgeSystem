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

    const shouldScroll = useMemo(() => !hasScrolled && hash && !!targetTab, [ hasScrolled, hash, targetTab ]);

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

            scrollToElement();

            const observer = new MutationObserver(() => {
                scrollToElement();
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
