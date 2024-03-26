
FROM node:18-alpine3.19


WORKDIR /app


COPY package*.json ./


RUN npm install

COPY . .


EXPOSE 8003

CMD ["node", "server.js"]
