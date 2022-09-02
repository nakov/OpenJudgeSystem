#!/bin/bash

docker-compose -f docker-compose.run.yml up -d db
for i in {1..5}; do
    echo "Sleeping $i"
    sleep 1
done;

docker-compose -f docker-compose.run.yml up -d --build update_restore_sql
docker-compose -f docker-compose.run.yml exec update_restore_sql yarn start
