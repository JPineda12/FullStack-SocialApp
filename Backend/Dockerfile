FROM node:14-alpine

COPY package*.json ./app/

WORKDIR /app

RUN npm install

COPY ./build /app

CMD node ./index.js
