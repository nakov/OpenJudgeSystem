#!/bin/bash
for file in /queries/restore/*.sql; do
echo $file;
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa  -P 1123QwER -i $file;
done;
