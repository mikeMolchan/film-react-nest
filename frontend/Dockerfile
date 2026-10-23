FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM alpine:3
COPY --from=build /app/dist /app/dist
CMD ["sh", "-c", "rm -rf /usr/share/nginx/html/* && cp -r /app/dist/. /usr/share/nginx/html/"]