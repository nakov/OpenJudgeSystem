/* eslint-disable import/prefer-default-export */
import groupBy from 'lodash/groupBy';

import { areStringEqual } from '../utils/compare-utils';

import { FilterInfo, FilterType, IFilter } from './contest-types';

const getNextIdGen = function* () {
    let index = 1;

    while (true) {
        yield index;
        index += 1;
    }
};

const getId = getNextIdGen();

const generateFilterItems = (type: FilterType, ...filters: FilterInfo[]) => filters.map(({ name, value }) => ({
    name,
    type,
    value,
    id: getId.next().value,
}));

const groupByType = (filters: IFilter[]) => {
    const groupedGroups = groupBy(filters, (f) => f.type);

    return Object.keys(groupedGroups)
        .map((groupType) => ({
            type: groupType as FilterType,
            filters: groupedGroups[groupType],
        }));
};

const filterByType = (filters: IFilter[], filterType: FilterType) => filters.filter(({ type }) => filterType === type);

const findFilterByTypeAndName = (filters: IFilter[], type: string, value: any) => filters
    .find(({ type: filterType, id }) =>
        areStringEqual(filterType, type, false) && 
        areStringEqual(value, id, false));

export {
    generateFilterItems,
    groupByType,
    filterByType,
    findFilterByTypeAndName,
};
