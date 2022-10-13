import isEqual from 'lodash/isEqual';

import { Anything } from '../common/common-types';

const areStringEqual = (obj1: Anything, obj2: Anything, isCaseSensitive = true) => {
    let str1 = obj1.toString();
    let str2 = obj2.toString();

    if (!isCaseSensitive) {
        str1 = str1.toLowerCase();
        str2 = str2.toLowerCase();
    }

    return isEqual(str1, str2);
};

export default { areStringEqual };

export {
    areStringEqual,
};
