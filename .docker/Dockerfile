### build app
FROM node:10.9-alpine as build-app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
WORKDIR /app

RUN echo 'http://mirrors.aliyun.com/alpine/v3.4/main' > /etc/apk/repositories \
    && echo "registry=\"https://registry.npm.taobao.org\"" > ~/.npmrc \
    && echo "sass_binary_site=https://npm.taobao.org/mirrors/node-sass/" >> ~/.npmrc \
    && npm install

ARG version
ADD . /app
RUN cp src/environments/environment.`echo $version | tr '[A-Z]' '[a-z]'`.ts src/environments/environment.prod.ts \
    && npm run login-build \
    && npm run operational-system-build \
    && npm run exemption-build \
    && npm run store-maintenance-build \
    && npm run order-parking-build \
    && npm run topic-build

### final image
FROM nginx:alpine

COPY .docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-app /app/dist /app/dist
