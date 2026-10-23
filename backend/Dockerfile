FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --omit=optional
COPY --from=build /app/dist ./dist
COPY public ./public
USER node
EXPOSE 3000
CMD ["node", "dist/main"]