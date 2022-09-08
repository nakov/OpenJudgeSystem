const { isDate } = require("util/types");
const moment = require('moment');

const {
    isNil,
} = require('./checkers');

const convertDate = (value) => moment(new Date(value)).format();

const normalizeValue = (value) => {
    if (isNil(value)) {
        return 'NULL';
    }
    else if (typeof (value) === 'number') {
        return value;
    }
    else if (typeof (value) === 'boolean') {
        return value
            ? 1
            : 0;
    }
    if (isDate(value)) {
        const dateString = convertDate(value);
        return `CAST(N'${dateString}' AS DateTime2)`;
    }

    if(Buffer.isBuffer(value)) {
        const hexValue = value.toString('hex');
        return `0x${hexValue}`.toUpperCase();
    }

    return `N'${value}'`;
};

const normalizeColumnName = (columnName) => `[${columnName}]`;

module.exports = {
    normalizeValue,
    normalizeColumnName,
};