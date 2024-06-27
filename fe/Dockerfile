FROM node:16.20 AS build-stage

WORKDIR /app-fe

COPY package*.json ./

RUN npm install

COPY . .


RUN npm run build

FROM nginx:stable-alpine

COPY --from=build-stage /app-fe/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

