#!/bin/bash
for file in /queries/restore/restore_db/queries/*.sql; 
do
	echo "--- Executing $file ---"
	/opt/mssql-tools/bin/sqlcmd -S localhost -U sa  -P 1123QwER -i $file;
done;