import { isEqual } from 'lodash';

const areStringEqual = (obj1: any, obj2: any, isCaseSensitive = true) => {
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
