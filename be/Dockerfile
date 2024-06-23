# 定义构建阶段
FROM python:3.10

# 设置工作目录
WORKDIR /app-be

# 复制整个应用目录
COPY . .

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 添加 wait-for-it.sh 脚本
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh


# 运行数据库迁移命令和启动 Gunicorn 服务器
CMD ["/wait-for-it.sh", "db:3306", "--", "bash", "-c", "cd myproject && python manage.py makemigrations && python manage.py migrate && gunicorn --chdir . --bind 0.0.0.0:8000 myproject.wsgi:application"]
