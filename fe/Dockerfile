FROM node:16.20 AS build-stage

WORKDIR /app-fe

COPY package*.json ./

RUN npm install

COPY . .

# 设置构建时环境变量
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL $REACT_APP_API_URL

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build-stage /app-fe/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

CMD ["/wait-for-it.sh", "be:8000", "--", "nginx", "-g", "daemon off;"]
