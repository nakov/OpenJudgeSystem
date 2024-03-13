const splitByCapitalLetter = (input: string) => input.split(/(?=[A-Z])/).join(' ');

const toLowerCase = (input: string) => input.toLowerCase();

const getEnumMemberName = <T extends object>(enumObj: T, enumMember: T[keyof T]): string => {
    const enumName = (Object.keys(enumObj) as Array<keyof T>).find((key) => enumObj[key] === enumMember);
    return enumName
        ? String(enumName)
        : '';
};

export default {
    splitByCapitalLetter,
    toLowerCase,
};

export {
    splitByCapitalLetter,
    toLowerCase,
    getEnumMemberName,
};
