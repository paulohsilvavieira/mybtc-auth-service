FROM node:18.16-alpine

RUN npm install -g npm

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --silent

RUN npm config set cache /tmp --global

COPY . .

