LABEL org.opencontainers.image.authors="darkyoooooo@gmail.com"

FROM node:alpine as fe_build
COPY frontend-app/package.json /fe_build/
WORKDIR /fe_build
RUN npm install
COPY frontend-app /fe_build
RUN npm run build

FROM nginx:latest
RUN apt-get update && \
    apt-get install -y curl sudo
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - && \
    sudo apt-get install -y nodejs && \
    echo "Installed node: " && \
    node --version && \
    npm install -g pnpm

COPY default.conf /etc/nginx/conf.d
COPY --from=fe_build /fe_build/dist /www/frontend

COPY backend-app /backend-app
WORKDIR /backend-app
RUN pnpm install

EXPOSE 80
EXPOSE 3478
CMD nginx && \
    cd /backend-app && \
    echo "Nginx started, now starting backend-app..." && \
    node index.js

