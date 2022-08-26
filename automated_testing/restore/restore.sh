#!/bin/bash
for file in ./*.sql; do
    echo " --- Executing $file ---"
    /opt/mssql-tools/bin/sqlcmd -S host.docker.internal -U sa -P 1123QwER -i /queries/restore/$file;
done;
