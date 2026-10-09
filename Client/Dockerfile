FROM node:20-alpine

WORKDIR /app

# 1. Copy package definitions and install dependencies
COPY package*.json ./
RUN npm install && chown -R node:node /app

# 2. Copy ALL project files (configs, assets, public, src)
COPY . .

# 3. Disable treating warnings as errors and build
RUN CI=false npm run build

# 4. Install static file server
RUN npm install -g serve

USER node

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]