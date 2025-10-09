FROM --platform=linux/amd64 node:20-alpine AS development
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

RUN npm install @css-inline/css-inline-linux-x64-musl --save

COPY . .
RUN npm run build:identity

FROM --platform=linux/amd64 node:20-alpine
WORKDIR /usr/src/app

COPY --from=development /usr/src/app/dist/apps/identity ./dist
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/package*.json ./

EXPOSE 4001

CMD ["node", "dist/apps/identity/main.js"]
