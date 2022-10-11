import generateSortingTypes from './sorting-utils';
import { SortType } from './contest-types';

const generateSortingStrategy = (() => {
    const result = generateSortingTypes(
        { name: SortType.Name, value: SortType.Name },
        { name: SortType.StartDate, value: SortType.StartDate },
        { name: SortType.EndDate, value: SortType.EndDate },
    );

    return () => result;
})();

export default generateSortingStrategy;
