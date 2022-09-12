FROM node:16

# RUN npm install -g yarn

WORKDIR /app

COPY ./update_restore_queries/package.json /app/package.json
COPY ./update_restore_queries/yarn.lock /app/yarn.lock

RUN yarn install

COPY ./update_restore_queries/helpers /app/helpers
COPY ./update_restore_queries/app.js /app/app.js

ENTRYPOINT ["tail", "-f", "/dev/null"]

