FROM ghcr.io/softuni-internal/judge_tests_base_linux

WORKDIR /src

RUN npm install -g yarn

COPY ./package.json /src/package.json
COPY ./yarn.lock /src/yarn.lock

RUN yarn

COPY ./wdio.conf.ts /src/wdio.conf.ts
COPY ./docker-compose.yml /src/docker-compose.yml
COPY ./.eslintrc.js /src/.eslintrc.js

COPY ./db /src/db
COPY ./restore /src/restore
COPY ./test /src/test
# COPY ../AutoCrudAdmin /src/AutoCrudAdmin
# COPY ../Common /src/Common
# COPY ../Data /src/Data
# COPY ../Docker /src/Docker
# COPY ../global.json /src/global.json
# COPY ../Servers /src/Servers
# COPY ../Services /src/Services
# COPY ../Tests /src/Tests
# COPY ../OpenJudgeSystem.sln /src/OpenJudgeSystem.sln

# RUN apt update -y && apt upgrade -y && apt install -y dos2unix

# RUN dos2unix -n /queries/restore/restore.sh /queries/restore/restore.sh

# RUN yarn run lint

CMD yarn run test
# CMD tail -f /dev/null
