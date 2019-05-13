FROM node:10.15-alpine AS build
WORKDIR /var/app
COPY . .

RUN yarn install --production=false && yarn dist


FROM node:10.15-alpine

COPY package.json yarn.lock ./
RUN yarn install

COPY --from=build /var/app/dist ./dist

EXPOSE 3003
