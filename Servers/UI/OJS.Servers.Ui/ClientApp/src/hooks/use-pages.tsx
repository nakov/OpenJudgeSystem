import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import isArray from 'lodash/isArray';

import { PageParams } from '../common/pages-types';
import { IHaveChildrenProps, IPagesInfo } from '../components/common/Props';

import { useUrlParams } from './common/use-url-params';

interface IPageContext {
    state: {
        currentPage: number;
        pagesInfo: IPagesInfo;
    };
      changePage: (pageNumber: number) => void;
      clearPageValue: () => void;
      populatePageInformation: (info: IPagesInfo) => void;
}

type IPageProviderProps = IHaveChildrenProps

const defaultState = {
    state: {
        currentPage: 1,
        pagesInfo: {
            itemsPerPage: 0,
            pageNumber: 1,
            totalItemsCount: 0,
            pagesCount: 1,
        },
    },
};

const PageContext = createContext<IPageContext>(defaultState as IPageContext);

const PageProvider = ({ children }: IPageProviderProps) => {
    const [ pagesInfo, setPagesInfo ] = useState<IPagesInfo>(defaultState.state.pagesInfo);

    const {
        state: { params },
        actions: {
            setParam,
            unsetParam,
        },
    } = useUrlParams();

    const populatePageInformation = useCallback(
        (pageInformation: IPagesInfo) => setPagesInfo(pageInformation),
        [],
    );

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
            state: {
                currentPage,
                pagesInfo,
            },
            changePage,
            clearPageValue,
            populatePageInformation,
        }),
        [ changePage, clearPageValue, currentPage, pagesInfo, populatePageInformation ],
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
