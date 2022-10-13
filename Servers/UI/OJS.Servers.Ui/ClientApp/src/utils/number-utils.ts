import isEmpty from 'lodash/isEmpty';

const oneBillion = 10 ** 9;
const oneMillion = 10 ** 6;
const oneThousand = 10 ** 3;

interface INamesMap {
    b: string;
    m: string;
    k: string;
    '': string;
}

type NamesMapKeys = 'b' | 'm' | 'k' | '';

const shortNamesMap = {
    b: 'B',
    m: 'M',
    k: 'K',
    '': '',
};

const longNamesMap = {
    b: 'Billion',
    m: 'Million',
    k: 'Thousand',
    '': '',
};

const format = (value: number, shortNames = true) => {
    const namesMap: INamesMap = shortNames
        ? shortNamesMap
        : longNamesMap;

    const [ normalizedValue, name ] = value >= oneBillion
        ? [ value / oneBillion, 'b' ]
        : value > oneMillion
            ? [ value / oneMillion, 'm' ]
            : value > oneThousand
                ? [ value / oneThousand, 'k' ]
                : [ value, '' ];

    if (isEmpty(name)) {
        return `${value}`;
    }

    return `${normalizedValue.toFixed(1)} ${namesMap[name as NamesMapKeys]}`;
};

export default { format };

export {
    format,
};
