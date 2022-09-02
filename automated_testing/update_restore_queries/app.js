const {
    writeFileSync,
    rmSync,
    existsSync,
    mkdirSync,
} = require("fs");

const path = require("path");

const sql = require('mssql');

const {
    getTablesOrder
} = require('./helpers/graphs');

const {
    normalizeValue,
    normalizeColumnName,
} = require('./helpers/normalizers');

const getData = async (sql) => {
    const tables = await sql.query('SELECT * FROM INFORMATION_SCHEMA.TABLES tables');
    // console.log(JSON.stringify(tables));
    return await Promise.all(tables.recordset.map(async ({
        TABLE_NAME: name,
        TABLE_SCHEMA: schema,
    }) => {
        const table = `[${schema}].[${name}]`;
        const rawData = await sql.query(`SELECT * FROM ${table}`);
        const data = rawData.recordset;

        return {
            tableName: name,
            table,
            data,
        };
    }));
};

const buildQueries = (data) => {
    return data.reduce((q, { table, data, tableName }) => {
        if (data.length === 0) {
            return q;
        }

        const columns = Object.keys(data[0]);
        const columnNames = columns
            .map(c => normalizeColumnName(c))
            .join(', ');
        const values = data.map(
            d => columns
                .map(column => normalizeValue(d[column]))
                .join(', '))
            .map(l => `(${l})`)
            .join(',\n');


        const query = `
USE [OpenJudgeSystem]
GO
SET ANSI_NULLS, QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'${table}'))
    SET IDENTITY_INSERT ${table} ON;
GO

INSERT INTO ${table} (${columnNames})
VALUES ${values}
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [object_id] = OBJECT_ID(N'${table}'))
    SET IDENTITY_INSERT ${table} OFF;
GO
`.trim();

        q.push({
            tableName,
            table,
            query
        });
        return q;
    }, [])
};

// const getQueriesDirectoryPath = () => path.join(__dirname, 'queries')
const getQueriesDirectoryPath  = () => '/queries';

const ensureQueriesDirectoryExists = () => {
    if (existsSync(getQueriesDirectoryPath())) {
        rmSync(getQueriesDirectoryPath(), {
            recursive: true,
        });
    }

    mkdirSync(getQueriesDirectoryPath());
};

const saveQuery = async ({ query, table }, index) => {
    const filepath = path.join(getQueriesDirectoryPath(), `${index + 1}__${table}.sql`);
    writeFileSync(filepath, query, 'utf-8');
};

const run = async () => {
    try {
        await sql.connect('Server=host.docker.internal;Database=OpenJudgeSystem;User Id=sa;Password=1123QwER;Encrypt=False')
        const data = await getData(sql);
        const queries = buildQueries(data);
        const tablesOrder = await getTablesOrder(sql, queries.map(q => q.tableName));

        ensureQueriesDirectoryExists();
        await Promise.all(
            queries
                .sort((x, y) => tablesOrder.indexOf(x.tableName) - tablesOrder.indexOf(y.tableName))
                .map((query, index) => saveQuery(query, index))
        );
    }
    catch (ex) {
        console.error(ex);
    }
};

run();