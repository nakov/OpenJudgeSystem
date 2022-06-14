/* eslint-disable import/prefer-default-export */
import { groupBy } from 'lodash';
import { FilterType, IFilter, FilterInfo } from './contest-types';

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

const isStatusFilter = ({ type }: IFilter) => type === FilterType.Status;

export {
    generateFilterItems,
    groupByType,
    isStatusFilter,
};
