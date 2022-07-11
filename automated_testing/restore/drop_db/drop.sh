#!/bin/bash
for file in ./06_Drop_DB.sql; do
echo $file;
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa  -P 1123QwER -i $file;
done;
