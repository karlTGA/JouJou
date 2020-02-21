FROM node:12-stretch AS Builder
WORKDIR /build
COPY . .
RUN yarn install
RUN yarn build

FROM node:12-stretch
WORKDIR /app
COPY --from=Builder /build/ .
RUN yarn install
CMD ["node", "/app/packages/server/build/index.js"]