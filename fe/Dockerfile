# 定义构建阶段
FROM node:16.20 AS build-stage

# 设置工作目录
WORKDIR /app-fe

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有前端代码
COPY . .

# 构建应用
RUN npm run build

# 定义运行阶段
FROM nginx:stable-alpine

# 复制构建结果到Nginx目录
COPY --from=build-stage /app-fe/build /usr/share/nginx/html

# 可选：如果您有自定义的nginx配置，复制它
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露80端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]

