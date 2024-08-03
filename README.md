# Project Setup(dev)

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
4. run `pip install -r requirements.txt`
5. `cd` into the myproject folder
6. run `python manage.py makemigrations myapp` and `python manage.py migrate`
   - this will create the database tables
7. run `python manage.py runserver`

## Test
1. `cd` into the be `be\myproject`
2. run `python manage.py test myapp/src/tests/`

# Project Setup(prod)

## launch the app through docker
1. Run `docker-compose up --build` at the root of the project
   - this will start the frontend, backend, mysql and phpmyadmin in docker containers.
   - **Note:** make sure your ports  8000 and 3306 are not being used by another service
2. Open your browser and go to `http://localhost/` to view the app