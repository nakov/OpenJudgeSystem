const {
    writeFileSync,
    existsSync,
    mkdirSync,
} = require("fs");

const rimraf = require('rimraf');

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

const getQueriesDirectoryPath = () => '/queries';

const ensureEmptyQueriesDirectoryExists = () => {
    return new Promise((resolve) => {
        const queriesDirectoryPath = getQueriesDirectoryPath();
        if (existsSync(queriesDirectoryPath)) {
            rimraf(`${queriesDirectoryPath}/*`,
                function () {
                    console.log(`${queriesDirectoryPath} cleaned`);
                    resolve();
                });
        }
        else {
            mkdirSync(queriesDirectoryPath);
            resolve();
        }
    })
};

const saveQuery = async ({ query, table }, index) => {
    const filepath = path.join(getQueriesDirectoryPath(), `${index + 1}__${table}.sql`);
    writeFileSync(filepath, query, 'utf-8');
};

const getSql = async ({ server, user, password, database }) => {
    const connetionString = [
        `Server=${server}`,
        `Database=${database}`,
        `User Id=${user}`,
        `Password=${password}`,
        'Encrypt=False'
    ]
        .join(';');
    await sql.connect(connetionString);
    return sql;
}

const run = async () => {
    const dbConfig = {
        server: 'host.docker.internal',
        user: 'sa',
        password: '1123QwER',
        database: 'OpenJudgeSystem',
    };

    try {
        const sql = await getSql(dbConfig);
        const data = await getData(sql);
        const queries = buildQueries(data);
        const tablesOrder = await getTablesOrder(sql, queries.map(q => q.tableName));

        await ensureEmptyQueriesDirectoryExists();
        await Promise.all(
            queries
                .sort((x, y) => tablesOrder.indexOf(x.tableName) - tablesOrder.indexOf(y.tableName))
                .map((query, index) => saveQuery(query, index))
        );
        sql.disc
    }
    catch (ex) {
        console.error(ex);
    }
    finally {

    }
};

run();