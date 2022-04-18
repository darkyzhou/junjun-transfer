FROM node:alpine AS build
WORKDIR /app
COPY frontend/package.json /app
RUN npm install
COPY frontend /app
RUN npm run build

FROM node:alpine AS final
WORKDIR /app
COPY server /app
RUN npm install
COPY --from=build /app/dist /app/public

EXPOSE 8080
CMD ["node", "index.js"]

LABEL org.opencontainers.image.authors="darkyoooooo@gmail.com"
