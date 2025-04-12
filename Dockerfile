# Dockerfile
FROM node:18 AS build
WORKDIR /src
COPY . .
RUN npm install && npm run build
