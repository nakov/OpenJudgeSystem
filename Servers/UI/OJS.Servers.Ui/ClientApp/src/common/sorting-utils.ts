import { SortInfo } from './contest-types';

const sortingType = 'SortType';

const getNextIdGen = function* () {
    let index = 1;

    while (true) {
        yield index;
        index += 1;
    }
};

const getId = getNextIdGen();

const generateSortingTypes = (...sorting: SortInfo[]) => sorting.map(({ name, value }) => ({
    name,
    type: sortingType,
    value,
    id: getId.next().value,
}));

export default generateSortingTypes;
