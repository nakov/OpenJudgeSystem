import React, { createContext, useCallback, useContext, useMemo } from 'react';
import isArray from 'lodash/isArray';

import { PageParams } from '../common/pages-types';
import { IHaveChildrenProps } from '../components/common/Props';

import { useUrlParams } from './common/use-url-params';

interface IPageContext {
    state: {
        currentPage: number;
    };
    actions: {
      changePage: (pageNumber: number | null) => void;
      clearPageValue: () => void;
    };
}

type IPageProviderProps = IHaveChildrenProps

const defaultState = {
    state: { currentPage: 1 },
    actions: { },
};

const PageContext = createContext<IPageContext>(defaultState as IPageContext);

const PageProvider = ({ children }: IPageProviderProps) => {
    const {
        state: { params },
        actions: {
            setParam,
            unsetParam,
        },
    } = useUrlParams();

    const changePage = useCallback(
        (pageNumber: number | null) => {
            setParam(PageParams.page, pageNumber);
        },
        [ setParam ],
    );

    const clearPageValue = useCallback(
        () => unsetParam(PageParams.page),
        [ unsetParam ],
    );

    const currentPage = useMemo(
        () => {
            const { value } = params.find((p) => p.key === PageParams.page) || { value: '1' };

            const theValue = isArray(value)
                ? value[0]
                : value;

            return parseInt(theValue, 10);
        },
        [ params ],
    );

    const value = useMemo(
        () => ({
            state: { currentPage },
            actions: {
                changePage,
                clearPageValue,
            },
        }),
        [ changePage, clearPageValue, currentPage ],
    );

    return (
        <PageContext.Provider value={value}>
            {children}
        </PageContext.Provider>
    );
};

const usePages = () => useContext(PageContext);

export default PageProvider;

export {
    usePages,
};
