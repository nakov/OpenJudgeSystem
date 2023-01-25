/* eslint-disable import/prefer-default-export */

const flattenWith = <T>(list: T[], flattenFunc: (item: T) => T[] | null) => {
    const result: T[] = [];
    const getChildren = (item: T) => {
        result.push(item);
        const children = flattenFunc(item) || [];
        children.forEach(getChildren);
    };
    list.forEach(getChildren);
    return result;
};

export {
    flattenWith,
};
