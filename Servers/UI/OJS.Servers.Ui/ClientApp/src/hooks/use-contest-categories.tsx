import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import ITreeItemType from '../common/tree-types';
import { IHaveChildrenProps } from '../components/common/Props';
import { flattenWith } from '../utils/list-utils';
import { getCategoriesTreeUrl } from '../utils/urls';

import { useHttp } from './use-http';

interface IContestCategoriesContext {
    state: {
        categories: ITreeItemType[];
        isLoaded: boolean;
        categoriesFlat: ITreeItemType[];
    };
    actions: {
        load: () => Promise<void>;
    };
}

type IContestCategoriesProviderProps = IHaveChildrenProps

const defaultState = { state: { categories: [] as ITreeItemType[], categoriesFlat: [] as ITreeItemType[] } };

const ContestCategoriesContext = createContext<IContestCategoriesContext>(defaultState as IContestCategoriesContext);

const ContestCategoriesProvider = ({ children }: IContestCategoriesProviderProps) => {
    const [ categories, setCategories ] = useState(defaultState.state.categories);

    const {
        get,
        data,
        isSuccess,
        isLoading,
    } = useHttp<null, ITreeItemType[]>({ url: getCategoriesTreeUrl });

    const load = useCallback(
        async () => {
            if (isEmpty(data) && !isLoading) {
                await get();
            }
        },
        [ get, data, isLoading ],
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

    const categoriesFlat = useMemo(
        () => flattenWith(categories, (c) => c.children || null),
        [ categories ],
    );

    const value = useMemo(
        () => ({
            state: {
                categories,
                isLoaded: categories.length > 0 && isSuccess,
                categoriesFlat,
            },
            actions: { load },
        }),
        [ categories, isSuccess, load, categoriesFlat ],
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
