#!/bin/bash
for file in ./00_Create_DB.sql; do
echo $file;
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa  -P 1123QwER -i $file;
done;
