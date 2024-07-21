FROM python:3.10


WORKDIR /app-be


COPY . .


RUN pip install --no-cache-dir -r requirements.txt


ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh



CMD ["/wait-for-it.sh", "db:3306", "--", "bash", "-c", "cd myproject && python manage.py makemigrations && python manage.py migrate && daphne -b 0.0.0.0 -p 8000 myproject.asgi:application"]