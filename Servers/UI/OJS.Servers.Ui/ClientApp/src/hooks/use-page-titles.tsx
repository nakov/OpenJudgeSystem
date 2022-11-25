import React, { createContext, useCallback, useContext, useMemo } from 'react';
import isNil from 'lodash/isNil';

import { IHaveChildrenProps } from '../components/common/Props';

interface IPageWithTitleParamsContext {
    actions: {
        setPageTitle: (title: string | undefined) => void;
    };
}

const defaultPageTitle = 'SoftUni Judge';

type IPageWithTitleProviderProps = IHaveChildrenProps

const PageWithTitleContext = createContext<IPageWithTitleParamsContext>({} as IPageWithTitleParamsContext);

const PageWithTitleProvider = ({ children }: IPageWithTitleProviderProps) => {
    const setPageTitle = useCallback(
        (title: string | undefined) => {
            document.title = isNil(title)
                ? defaultPageTitle
                : `${title} - ${defaultPageTitle}`;
        },
        [],
    );

    const value = useMemo(
        () => ({ actions: { setPageTitle } }),
        [ setPageTitle ],
    );

    return (
        <PageWithTitleContext.Provider value={value}>
            {children}
        </PageWithTitleContext.Provider>
    );
};

const usePageTitles = () => useContext(PageWithTitleContext);

export default PageWithTitleProvider;

export {
    usePageTitles,
};
