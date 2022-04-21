/* eslint-disable import/prefer-default-export */
import { groupBy } from 'lodash';
import { FilterType, IFilter } from './contest-types';

const getNextIdGen = function* () {
    let index = 1;
    while (true) {
        yield index;
        index += 1;
    }
};

const getId = getNextIdGen();

const generateFilterItems = (type: FilterType, ...names: string[]) => names.map((name) => ({
    name,
    type,
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

export {
    generateFilterItems,
    groupByType,
};
