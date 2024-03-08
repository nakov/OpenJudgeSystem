const DEFAULT_ITEMS_PER_PAGE = 10;

const DEFAULT_ROWS_PER_PAGE = [ 10, 25, 50, 100 ];

const COMPETE_STRING = 'COMPETE';
const PRACTICE_STRING = 'PRACTICE';

// eslint-disable-next-line consistent-return
const generateContestBtnUrlString = (isCompete: boolean, id?: number) => {
    if (id) {
        if (isCompete) {
            return `/contests/${id}/compete`;
        }
        return `/contests/${id}/practice`;
    }
};

export {
    DEFAULT_ROWS_PER_PAGE,
    DEFAULT_ITEMS_PER_PAGE,
    PRACTICE_STRING,
    COMPETE_STRING,
    generateContestBtnUrlString,
};
