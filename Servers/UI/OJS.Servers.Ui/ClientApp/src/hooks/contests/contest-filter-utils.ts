import { ITreeItemType } from '../../components/guidelines/trees/Tree';
import { ContestStatus, FilterType, IContestStrategyFilter, IFilter } from '../../common/contest-types';
import { generateFilterItems } from '../../common/filter-utils';
import { IContestCategoryTreeType } from '../../common/types';

const addCategoryLeafFilters = ({ id, name, children: treeChildren }: ITreeItemType, arr: IFilter[], cache: Map<string, IFilter>) => {
    treeChildren?.forEach((c) => {
        addCategoryLeafFilters(c, arr, cache);
    });
    
    if(!cache.has(id)) {
        cache.set(id, { name, value: id.toString() } as IFilter); 
    }

    arr.push(cache.get(id)!);
};

const generateCategoryFilters =(() => {
    const categoriesCache = new Map();

    return (categories: IContestCategoryTreeType[]) => {
        const categoryFilters = [] as IFilter[];

        categories?.forEach((c) => addCategoryLeafFilters(c, categoryFilters, categoriesCache));

        return generateFilterItems(FilterType.Category, ...categoryFilters);
    };
})();

const generateStatusFilters = (() => {
    const result = generateFilterItems(
        FilterType.Status,
        { name: ContestStatus.All, value: ContestStatus.All },
        { name: ContestStatus.Active, value: ContestStatus.Active },
        { name: ContestStatus.Past, value: ContestStatus.Past },
    );

    return () => result;
})();

const generateStrategyFilters = (() => {
    const strategiesCache = new Map();

    return (strategies: IContestStrategyFilter[]) => {
        const strategyFilters = strategies?.map(({ name, id }) => {
            if(!strategiesCache.has(id)) {
                strategiesCache.set(id, { name, value: id.toString() });
            }

            return strategiesCache.get(id);
        }) ?? [];

        return generateFilterItems(FilterType.Strategy, ...strategyFilters);
    };
})();

export {
    generateCategoryFilters,
    generateStrategyFilters,
    generateStatusFilters,
};
