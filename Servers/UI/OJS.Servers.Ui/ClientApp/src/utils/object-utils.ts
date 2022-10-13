import { Anything } from '../common/common-types';

const toList = (obj: Anything) => Object.keys(obj)
    .map((key) => ({ key, value: obj[key] }));

export default { toListOfKeyValue: toList };

export {
    toList,
};
