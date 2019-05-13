FROM node:10.15-alpine AS build

ENV PORT=8080
ENV SKIP_PREFLIGHT_CHECK=true

WORKDIR /var/app

COPY . .
RUN yarn install --production=false && yarn build


FROM node:10.15-alpine

RUN yarn global add serve

COPY --from=build /var/app/dist ./dist

EXPOSE 8080

ENTRYPOINT serve -s -l 8080 ./dist
