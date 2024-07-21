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
                        // 停止并删除任何现有的容器
                        sh "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} down"
                        
                        // 移除所有停止的容器，确保没有命名冲突
                        sh "docker rm \$(docker ps -a -q)"
                        
                        // 构建并启动容器
                        sh "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} up --build -d"
                    } else {
                        // 停止并删除任何现有的容器
                        powershell "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} down"
                        
                        // 移除所有停止的容器，确保没有命名冲突
                        powershell "docker rm \$(docker ps -a -q)"
                        
                        // 构建并启动容器
                        powershell "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} up --build -d"
                    }
                }
            }
        }
    }
}
