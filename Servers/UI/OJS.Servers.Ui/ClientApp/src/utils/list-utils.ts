/* eslint-disable import/prefer-default-export */

const flattenWith = <T>(list: T[], flattenFunc: (item: T) => T[] | null) => list.reduce(
    (result: T[], item: T) => {
        const children = flattenFunc(item) || [];

        return [
            item,
            ...children,
        ];
    },
    [],
);

export {
    flattenWith,
};
