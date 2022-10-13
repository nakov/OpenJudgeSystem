import generateSortingTypes from './sorting-utils';
import { FilterType, SortType } from './contest-types';

const generateSortingStrategy = (() => {
    const result = generateSortingTypes(
        FilterType.Sort,
        { name: SortType.Name, value: SortType.Name },
        { name: SortType.StartDate, value: SortType.StartDate },
        { name: SortType.EndDate, value: SortType.EndDate },
    );

    return () => result;
})();

export default generateSortingStrategy;
