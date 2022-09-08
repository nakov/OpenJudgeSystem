#!/bin/bash

docker pull redis:5.0 \
    && docker pull mcr.microsoft.com/mssql/server:2019-latest \
    && docker-compose build tests judge_ui db \
    && docker-compose up -d tests \
    && docker-compose logs -f tests