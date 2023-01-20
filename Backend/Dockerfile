FROM node:latest

COPY package*.json ./app/

WORKDIR /app

RUN npm install

COPY ./build /app

CMD node ./index.js