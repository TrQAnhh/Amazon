FROM node:20-alpine AS development
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:gateway

FROM node:20-alpine
WORKDIR /usr/src/app

COPY --from=development /usr/src/app/dist/apps/api-gateway ./dist
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/package*.json ./

EXPOSE 3000

CMD ["node", "dist/apps/api-gateway/src/main.js"]
