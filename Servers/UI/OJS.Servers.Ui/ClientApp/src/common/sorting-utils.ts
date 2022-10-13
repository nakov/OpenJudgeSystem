import { FilterType, SortInfo } from './contest-types';

const getNextIdGen = function* () {
    let index = 1;

    while (true) {
        yield index;
        index += 1;
    }
};

const getId = getNextIdGen();

const generateSortingTypes = (type: FilterType, ...sorting: SortInfo[]) => sorting.map(({ name, value }) => ({
    name,
    type,
    value,
    id: getId.next().value,
}));

export default generateSortingTypes;
