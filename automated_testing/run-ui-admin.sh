#!/bin/bash

docker-compose -f docker-compose.run.yml build db judge_ui judge_administration
docker-compose -f docker-compose.run.yml up -d db redis
for i in {1..5}; do
    echo "Sleeping $i"
    sleep 1
done;

docker-compose -f docker-compose.run.yml exec db /bin/bash /queries/restore/create_db/create.sh
docker-compose -f docker-compose.run.yml exec db /bin/bash /queries/restore/restore_db/restore.sh

docker-compose -f docker-compose.run.yml up -d judge_ui judge_administration
