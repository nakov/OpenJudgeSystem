const splitByCapitalLetter = (input: string) => input.split(/(?=[A-Z])/).join(' ');

const toLowerCase = (input: string) => input.toLowerCase();

export default {
    splitByCapitalLetter,
    toLowerCase,
};

export {
    splitByCapitalLetter,
    toLowerCase,
};
