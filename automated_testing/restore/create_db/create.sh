#!/bin/bash
echo '----';
pwd;
for file in /queries/restore/create_db/*.sql; 
do
	echo $file;
	echo $file > /result.txt;
	echo 'file';
	# /opt/mssql-tools/bin/sqlcmd -S host.docker.internal -U sa  -P 1123QwER -i /queries/restore/create_db/$file;
done;
echo 'done';