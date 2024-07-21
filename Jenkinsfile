pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        DOCKER_COMPOSE_PROJECT_NAME = 'capstone-project'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Run Docker Compose') {
            steps {
                script {
                    if (isUnix()) {
                        sh "docker-compose down"
                        sh "docker-compose up --build -d"
                    
                    } else {
                        powershell "docker-compose down"
                        powershell "docker-compose up --build -d"


                    }
                }
            }
        }
        
    }

}
