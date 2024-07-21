pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        DOCKER_COMPOSE_PROJECT_NAME = 'capstone-project'
        IMAGE_NAME = 'my-image:latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Checked out the source code"
            }
        }

        stage('Build Docker Compose') {
            steps {
                script {
                    echo "Building Docker Compose services..."
                    if (isUnix()) {
                        sh "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} build"
                    } else {
                        powershell "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} build"
                    }
                    echo "Docker Compose build completed"
                }
            }
        }

        stage('Run Docker Compose') {
            steps {
                script {
                    echo "Stopping any existing containers..."
                    if (isUnix()) {
                        sh "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} down"
                        def containers = sh(script: "docker ps -a -q", returnStdout: true).trim()
                        if (containers) {
                            sh "docker rm \$(docker ps -a -q) -f"
                        }
                    } else {
                        powershell "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} down"
                        def containers = powershell(returnStdout: true, script: "docker ps -a -q").trim()
                        if (containers) {
                            powershell "docker rm \$(docker ps -a -q) -f"
                        }
                    }
                    echo "Existing containers stopped and removed"

                    echo "Running Docker Compose services..."
                    if (isUnix()) {
                        sh "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} up --build -d"
                    } else {
                        powershell "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} up --build -d"
                    }
                    echo "Docker Compose services are up and running"

                    // 确认容器已启动
                    sleep 10
                }
            }
        }

        stage('Commit Containers to Images') {
            steps {
                script {
                    echo "Committing Docker container to image..."
                    if (isUnix()) {
                        def containerId = sh(script: "docker ps -q --filter 'name=${env.DOCKER_COMPOSE_PROJECT_NAME}'", returnStdout: true).trim()
                        echo "Container ID: ${containerId}"
                        if (containerId) {
                            sh "docker commit ${containerId} ${env.IMAGE_NAME}"
                            echo "Committed container ${containerId} to image ${env.IMAGE_NAME}"
                        } else {
                            error "No container found to commit"
                        }
                    } else {
                        def containerId = powershell(returnStdout: true, script: "docker ps -q --filter 'name=${env.DOCKER_COMPOSE_PROJECT_NAME}'").trim()
                        echo "Container ID: ${containerId}"
                        if (containerId) {
                            powershell "docker commit ${containerId} ${env.IMAGE_NAME}"
                            echo "Committed container ${containerId} to image ${env.IMAGE_NAME}"
                        } else {
                            error "No container found to commit"
                        }

                        // 停止现有容器
                        powershell "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} down"
                        echo "Stopped Docker Compose services"

                        // 等待5秒
                        sleep 5

                        // 启动镜像，并映射端口
                        powershell "docker run -d -p 80:80 -p 8080:8080 -p 8000:8000 -p 3306:3306 ${env.IMAGE_NAME}"
                        echo "Started container from image ${env.IMAGE_NAME}"
                    }
                }
            }
        }
    }
}
