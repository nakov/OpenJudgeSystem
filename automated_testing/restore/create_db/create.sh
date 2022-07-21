#!/bin/bash
for file in /queries/restore/create_db/*.sql; 
do
	/opt/mssql-tools/bin/sqlcmd -S localhost -U sa  -P 1123QwER -i $file;
done;