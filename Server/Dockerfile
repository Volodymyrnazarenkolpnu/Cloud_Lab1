FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache mysql-client
COPY package.json package-lock.json ./
RUN npm ci && chown -R node:node /app
COPY --chown=node:node . .
USER node


EXPOSE 5050

CMD ["node", "server.js"]