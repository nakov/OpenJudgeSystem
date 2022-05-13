import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { without } from 'lodash';
import { IHaveChildrenProps } from '../components/common/Props';
import { IContestCategoryTreeType, IIndexContestsType } from '../common/types';
import { ContestState, FilterType, IFilter } from '../common/contest-types';
import { useHttp } from './use-http';
import { useUrls } from './use-urls';
import { generateFilterItems } from '../common/filter-utils';

interface IContestCategoriesContext {
    state: {
        categories: IContestCategoryTreeType[];
    };
    actions: {
        reload: () => Promise<void>;
    };
}

interface IContestCategoriesProviderProps extends IHaveChildrenProps {
}

const defaultState = {
    state: {
        categories: [] as IContestCategoryTreeType[],
    },
};

const ContestCategoriesContext = createContext<IContestCategoriesContext>(defaultState as IContestCategoriesContext);

const ContestCategoriesProvider = ({ children }: IContestCategoriesProviderProps) => {
    const [categories, setCategories] = useState(defaultState.state.categories);
    const { getUrlForCategoriesTree } = useUrls();

    const getCategoriesTreeUrl = useCallback(
        () => getUrlForCategoriesTree(),
        [ getUrlForCategoriesTree ],
    );

    const {
        get,
        data,
    } = useHttp(getCategoriesTreeUrl);

    const reload = useCallback(
        async () => {
            await get();
        },
        [ get ],
    );

    useEffect(
        () => {
            (async () => {
                await reload();
            })();
        },
        [ reload ],
    );

    useEffect(
        () => {
            setCategories(data as IContestCategoryTreeType[]);
        },
        [ data ],
    );

    const value = {
        state: {
            categories,
        },
        actions: {
            reload,
        }
    };

    return (
        <ContestCategoriesContext.Provider value={value}>
            {children}
        </ContestCategoriesContext.Provider>
    );
}

const useContestCategories = () => useContext(ContestCategoriesContext);

export default ContestCategoriesProvider;

export {
    useContestCategories,
};