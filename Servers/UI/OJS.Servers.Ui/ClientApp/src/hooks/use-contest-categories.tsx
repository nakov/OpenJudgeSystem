import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import ITreeItemType from '../common/tree-types';
import { IHaveChildrenProps } from '../components/common/Props';

import { useHttp } from './use-http';
import { useLoading } from './use-loading';
import { useUrls } from './use-urls';

interface IContestCategoriesContext {
    state: {
        categories: ITreeItemType[];
        isLoaded: boolean;
    };
    actions: {
        load: () => Promise<void>;
    };
}

type IContestCategoriesProviderProps = IHaveChildrenProps

const defaultState = { state: { categories: [] as ITreeItemType[] } };

const ContestCategoriesContext = createContext<IContestCategoriesContext>(defaultState as IContestCategoriesContext);

const ContestCategoriesProvider = ({ children }: IContestCategoriesProviderProps) => {
    const [ categories, setCategories ] = useState(defaultState.state.categories);
    const { getCategoriesTreeUrl } = useUrls();
    const { startLoading, stopLoading } = useLoading();

    const {
        get,
        data,
        isSuccess,
    } = useHttp<null, ITreeItemType[]>({ url: getCategoriesTreeUrl });

    const load = useCallback(
        async () => {
            startLoading();
            await get();
            stopLoading();
        },
        [ get, startLoading, stopLoading ],
    );

    useEffect(
        () => {
            if (isNil(data) || isEmpty(data)) {
                return;
            }

            setCategories(data);
        },
        [ data ],
    );

    const value = useMemo(
        () => ({
            state: {
                categories,
                isLoaded: isSuccess,
            },
            actions: { load },
        }),
        [ categories, isSuccess, load ],
    );

    return (
        <ContestCategoriesContext.Provider value={value}>
            {children}
        </ContestCategoriesContext.Provider>
    );
};

const useContestCategories = () => useContext(ContestCategoriesContext);

export default ContestCategoriesProvider;

export {
    useContestCategories,
};
