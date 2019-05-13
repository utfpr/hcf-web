FROM node:10.15-alpine AS build

WORKDIR /var/app

COPY . .
RUN yarn install --production=false && yarn dist


FROM node:10.15-alpine

RUN yarn global add serve

COPY --from=build /var/app/dist ./dist

EXPOSE 8080

ENTRYPOINT serve -s -l 8080 ./dist
