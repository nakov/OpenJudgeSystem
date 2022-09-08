const getDepedenciesQuery = (tableNames) => {
    const tableNamesParam = tableNames
        .map(t => `'${t}'`)
        .join(',')

    return `
SELECT
    OBJECT_NAME(f.referenced_object_id) as parent,
    OBJECT_NAME(f.parent_object_id) child
FROM
    sys.foreign_keys AS f
INNER JOIN
    sys.foreign_key_columns AS fc
ON
    f.OBJECT_ID = fc.constraint_object_id
INNER JOIN
    sys.tables t
ON
    t.OBJECT_ID = fc.referenced_object_id
WHERE
    OBJECT_NAME (f.referenced_object_id) in (${tableNamesParam})`;
}

module.exports = {
    getDepedenciesQuery,
}