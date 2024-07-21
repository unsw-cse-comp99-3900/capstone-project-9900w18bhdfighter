pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        DOCKER_COMPOSE_PROJECT_NAME = 'capstone-project'
        IMAGE_NAME = 'my-image:latest' // 添加版本标签
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Compose') {
            steps {
                script {
                    if (isUnix()) {
                        sh "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} build"
                    } else {
                        powershell "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} build"
                    }
                }
            }
        }

        stage('Run Docker Compose') {
            steps {
                script {
                    if (isUnix()) {
                        sh "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} up --build -d"
                    } else {
                        powershell "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} up --build -d"
                    }
                }
            }
        }

        stage('Commit Containers to Images') {
            steps {
                script {
                    if (isUnix()) {
                        def containerId = sh(script: "docker ps -q --filter 'name=${env.DOCKER_COMPOSE_PROJECT_NAME}_web_1'", returnStdout: true).trim()
                        if (containerId) {
                            sh "docker commit ${containerId} ${env.IMAGE_NAME}"
                        }
                    } else {
                        def containerId = powershell(returnStdout: true, script: "docker ps -q --filter 'name=${env.DOCKER_COMPOSE_PROJECT_NAME}_web_1'").trim()
                        if (containerId) {
                            powershell "docker commit ${containerId} ${env.IMAGE_NAME}"
                            echo "docker commit ${containerId} ${env.IMAGE_NAME}"
                        }
                        powershell "docker-compose down"
                        sleep 5
                        powershell "docker run -d -p 80:80 -p 8080:8080 -p 8000:8000 -p 3306:3306 ${env.IMAGE_NAME}"
                    }
                }
            }
        }
    }
}
