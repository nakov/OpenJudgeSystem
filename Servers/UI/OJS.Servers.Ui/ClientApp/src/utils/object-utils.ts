/* eslint-disable @typescript-eslint/no-explicit-any */

const toList = (obj: any) => Object.keys(obj)
    .map((key) => ({ key, value: obj[key] }));

export default { toListOfKeyValue: toList };

export {
    toList,
};
