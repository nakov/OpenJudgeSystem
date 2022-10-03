import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isEmpty, isNil } from 'lodash';
import { useContestCategories } from '../../../hooks/use-contest-categories';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import { useContests } from '../../../hooks/use-contests';
import { IHaveOptionalClassName } from '../../common/Props';
import { IFilter } from '../../../common/contest-types';
import { useCategoriesBreadcrumbs } from '../../../hooks/use-contest-categories-breadcrumb';
import ITreeItemType from '../../../common/tree-types';

import styles from './ContestCategories.module.scss';
import Tree from '../../guidelines/trees/Tree';

interface IContestCategoriesProps extends IHaveOptionalClassName {
    onCategoryClick: (filter: IFilter) => void;
    defaultSelected?: string,
   
}



const ContestCategories = ({
    className = '',
    onCategoryClick,
    defaultSelected,
}: IContestCategoriesProps) => {
    const { state: { categories } } = useContestCategories();
    const { state: { possibleFilters } } = useContests();
    const { actions: { updateBreadcrumb } } = useCategoriesBreadcrumbs();
    
    const flattenTree = useCallback(
        (treeItems: ITreeItemType[], result: ITreeItemType[]) => {
            treeItems.forEach(({ children, ...rest }) => {
                result.push(rest);

                if (!isNil(children)) {
                    flattenTree(children, result);
                }
            });

            return result;
        },
        [],
    );
    const getParents = useCallback(
        (result: string[], allItems: ITreeItemType[], searchId?: string) => {
            if (isNil(searchId)) {
                return result;
            }

            const node = allItems.find(({ id }) => id.toString() === searchId);

            if (isNil(node)) {
                return result;
            }

            if (node.id.toString() === searchId) {
                result.push(searchId);
            }

            getParents(result, allItems, node.parentId?.toString());

            return result;
        },
        [],
    );
    const categoriesFlat = useMemo(
        () => flattenTree(categories, []),
        [ categories, flattenTree ],
    );
    const defaultExpanded = useMemo(
        () => getParents([], categoriesFlat, defaultSelected),
        [ defaultSelected, categoriesFlat, getParents ],
    );
    const handleTreeLabelClick = useCallback((node: ITreeItemType) => {
        const filter = possibleFilters.find(({ value }) => value.toString() === node.id.toString());
        const category = categoriesFlat.find(({ id }) => id.toString() === node.id.toString());

        if (isNil(filter)) {
            return;
        }

        onCategoryClick(filter);
        updateBreadcrumb(category, categoriesFlat);
    }, [ possibleFilters, categoriesFlat, onCategoryClick, updateBreadcrumb ]);


    const [ expandedCategoriesIds, setExpandedIds ] = useState([] as string[]);
    const [ selectedCategoryId, setSelectedId ] = useState('');
    
    // const handleTreeItemClick = useCallback(
    //     (node: ITreeItemType) => {
    //         const id = node.id.toString();
    //         const newExpanded = expandedCategoriesIds.includes(id)
    //             ? without(expandedCategoriesIds,id)
    //             : [ ...expandedCategoriesIds,id ];
    //
    //         setExpandedIds(newExpanded);
    //     },
    //     [ expandedCategoriesIds, setExpandedIds ],
    // );
    //
    // const handleLabelClick = useCallback(
    //     (node: ITreeItemType) => {
    //         setSelectedId(node.id.toString());
    //
    //         handleTreeLabelClick(node);
    //     },
    //     [ handleTreeLabelClick ],
    // );
    
    
    // const renderCategoryTree = useCallback((node: ITreeItemType) => (
    //     <div className={styles.categoriesTree} key={node.id}>
    //         <div className={styles.tooltip}>
    //             <div className={styles.tooltipElement}
    //             >
    //                 {node.name}
    //             </div>
    //         </div>
    //         <TreeItem
    //             key={node.id}
    //             className={styles.treeElement}
    //             nodeId={node.id.toString()}
    //             label={node.name}
    //             onClick={() => handleTreeItemClick(node)}
    //             onLabelClick={() => handleLabelClick(node)}
    //         >
    //             {isArray(node.children)
    //                 ? node.children.map((child) => renderCategoryTree(child))
    //                 : null}
    //         </TreeItem>
    //     </div>
    // ), [ handleLabelClick, handleTreeItemClick ]);
    
    useEffect(
        () => {
            if (isEmpty(selectedCategoryId) && defaultSelected) {
                setSelectedId(defaultSelected);
            }
        },
        [ defaultSelected, selectedCategoryId ],
    );
    
    useEffect(() => {
        console.log(expandedCategoriesIds);   
    },[ expandedCategoriesIds ]);

    useEffect(()=>{
        if(!isEmpty(expandedCategoriesIds)){
            setExpandedIds(defaultExpanded);
        }
    },[ defaultExpanded, expandedCategoriesIds ]);
    
    // useEffect(
    //     () => {
    //         if (isEmpty(expandedCategoriesIds) && !isEmpty(defaultExpanded)) {
    //             setExpandedIds(defaultExpanded);
    //         }
    //     },
    //     [ defaultExpanded, expandedCategoriesIds ],
    // );
    
    return (
        <div className={className as string}>
            <Heading
                type={HeadingType.small}
                className={styles.heading}
            >
                Category
            </Heading>
            <Tree
                items={categories}
                onSelect={handleTreeLabelClick}
                defaultSelected={defaultSelected}
                defaultExpanded={defaultExpanded}
                treeItemHasTooltip
                // itemFunc={renderCategoryTree}
            />
        </div>
    );
};

export default ContestCategories;
