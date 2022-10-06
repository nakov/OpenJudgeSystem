import React, { createContext, useCallback, useContext, useState } from 'react';
import { isNil } from 'lodash';
import ITreeItemType from '../common/tree-types';
import { IHaveChildrenProps } from '../components/common/Props';
import { IContestCategoryTreeType } from '../common/types';

interface ICategoriesBreadcrumbContext {
    state: {
        breadcrumbItems: ICategoriesBreadcrumbItem[];
    };
    actions: {
        updateBreadcrumb: (category: ITreeItemType | undefined, flattenTree: ITreeItemType[] | []) => void;
    };
}

interface ICategoriesBreacrumbProviderProps extends IHaveChildrenProps {
}

interface ICategoriesBreadcrumbItem {
    id: string,
    isLast: boolean,
    value: string,
    orderBy: number,
}

const defaultState = { state: { breadcrumbItems: [] as ICategoriesBreadcrumbItem[] } };

const CategoriesBreadcrumbContext = createContext<ICategoriesBreadcrumbContext>(defaultState as ICategoriesBreadcrumbContext);

const orderByAsc = (x : ICategoriesBreadcrumbItem, y: ICategoriesBreadcrumbItem) => y.orderBy - x.orderBy;

const CategoriesBreadcrumbProvider = ({ children }: ICategoriesBreacrumbProviderProps) => {
    const [ breadcrumbItems, setBreadcrumbItems ] = useState(defaultState.state.breadcrumbItems);

    const updateBreadcrumb = useCallback(
        (category: IContestCategoryTreeType | undefined, categoriesTree: ITreeItemType[] | []) => {
            if (isNil(category) || isNil(categoriesTree)) {
                return;
            }

            const { id, name, parentId } = category;

            const allBreadcrumbItems = [] as ICategoriesBreadcrumbItem[];
            let index = 0;

            allBreadcrumbItems.push({
                id,
                value: name,
                isLast: true,
                orderBy: index,
            } as ICategoriesBreadcrumbItem);

            const populateBreadcrumbItemsByParents = (categoryParentId?: string) => {
                if (isNil(categoryParentId)){
                    return;
                }

                index += 1;

                const { id: parentCategoryId, name: parentCategoryName, parentId: currentParrentId } = categoriesTree
                    .find(x => x.id === categoryParentId) as ITreeItemType;

                if (isNil(parentCategoryId)) {
                    return;
                }

                allBreadcrumbItems.push({
                    id: parentCategoryId,
                    value: parentCategoryName,
                    isLast: false,
                    orderBy: index,
                } as ICategoriesBreadcrumbItem);

                populateBreadcrumbItemsByParents(currentParrentId);
            };

            populateBreadcrumbItemsByParents(parentId);
            
            allBreadcrumbItems
                .sort(orderByAsc);

            setBreadcrumbItems([ ...allBreadcrumbItems ]);
        },
        [ setBreadcrumbItems ],
    );

    const value = {
        state: { breadcrumbItems },
        actions: { updateBreadcrumb },
    } as ICategoriesBreadcrumbContext;

    return (
        <CategoriesBreadcrumbContext.Provider value={value}>
            {children}
        </CategoriesBreadcrumbContext.Provider>
    );
};


const useCategoriesBreadcrumbs = () => useContext(CategoriesBreadcrumbContext);

export default CategoriesBreadcrumbProvider;

export {
    useCategoriesBreadcrumbs,
};

export type {
    ICategoriesBreadcrumbItem,
};
