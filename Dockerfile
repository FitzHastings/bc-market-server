FROM node:22-alpine as builder

WORKDIR /usr/src/back
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /usr/src/back/dist ./dist
COPY --from=builder /usr/src/back/public-static ./public-static
COPY --from=builder /usr/src/back/.env ./.env
COPY --from=builder /usr/src/back/templates ./templates

EXPOSE 3000

CMD ["npm", "run", "start:prod"]