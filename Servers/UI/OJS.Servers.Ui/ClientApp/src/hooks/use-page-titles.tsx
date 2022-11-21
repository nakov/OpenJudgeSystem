import React, { createContext, useCallback, useContext, useMemo } from 'react';

import { IHaveChildrenProps } from '../components/common/Props';

interface IPageTitleParamsContext {
    actions: {
        setPageTitle: (title: string) => void;
    };
}

type IPageTitleProviderProps = IHaveChildrenProps

const PageTitleContext = createContext<IPageTitleParamsContext>({} as IPageTitleParamsContext);

const PageTitleProvider = ({ children }: IPageTitleProviderProps) => {
    const defaultTitlePage = useMemo(
        () => 'SoftUni Judge',
        [],
    );

    const setPageTitle = useCallback(
        (title: string) => {
            if (title === defaultTitlePage) {
                document.title = defaultTitlePage;
            } else {
                document.title = `${title} - ${defaultTitlePage}`;
            }
        },
        [ defaultTitlePage ],
    );

    const value = useMemo(
        () => ({ actions: { setPageTitle } }),
        [ setPageTitle ],
    );

    return (
        <PageTitleContext.Provider value={value}>
            {children}
        </PageTitleContext.Provider>
    );
};

const usePageTitles = () => useContext(PageTitleContext);

export default PageTitleProvider;

export {
    usePageTitles,
};
