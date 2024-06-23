# Project Setup

## At the root of the project(same for both frontend and backend)
1. Run `npm install`
2. Run `docker-compose -f docker-compose.dev.yml up --build`
   - this will start mysql and phpmyadmin in docker containers
   - **Note:** make sure your port 3306 is not being used by another service

## Frontend
1. `cd` into the fe folder
2. Run `npm install`
3. Run `npm start`

## Backend
1. `cd` into the be folder
2. Created and activate a virtual environment in the be file(myenv)
3. Install and set up Django project(myproject) (use pip3/python3 rather than pip)
4. `cd` into the myproject folder
5. run `python manage.py makemigrations` and `python manage.py migrate`
   - this will create the database tables
6. run `python manage.py runserver`
