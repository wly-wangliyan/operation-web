FROM node:8.9-alpine

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
WORKDIR /app

RUN echo 'http://mirrors.aliyun.com/alpine/v3.4/main' > /etc/apk/repositories \
    && apk update && apk add --no-cache nginx \
    && echo "registry=\"https://registry.npm.taobao.org\"" > ~/.npmrc \
    && echo "sass_binary_site=https://npm.taobao.org/mirrors/node-sass/" >> ~/.npmrc \
    && npm install -g --unsafe-perm @angular/cli@6.1.4 \
    && npm install

COPY .docker/nginx.conf /etc/nginx/nginx.conf

ARG version

ADD . /app

RUN cp src/environments/environment.`echo $version | tr '[A-Z]' '[a-z]'`.ts src/environments/environment.prod.ts \
    && ng build --prod

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
