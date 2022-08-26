#!/bin/bash
for file in /queries/restore/create_db/*.sql;
do
    echo " --- Executing $file ---"
    /opt/mssql-tools/bin/sqlcmd -S host.docker.internal -U sa  -P 1123QwER -i $file;
done;