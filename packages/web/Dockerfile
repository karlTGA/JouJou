FROM node:12-stretch AS Builder
WORKDIR /build
COPY . .
RUN yarn install
RUN yarn build

FROM nginx:1.17.8
WORKDIR /app
COPY --from=Builder /build/packages/web/build/ /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]