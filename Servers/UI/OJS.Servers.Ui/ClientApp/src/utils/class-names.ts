type classNamesType = string | string[] | null | undefined;

const concatClassNames = (...classNames:classNamesType[]) => classNames
    .filter((x) => x)
    .flat()
    .join(' ');

export default concatClassNames;
