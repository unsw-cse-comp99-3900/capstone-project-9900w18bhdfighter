pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        DOCKER_COMPOSE_PROJECT_NAME = 'capstone-project'
        COMBINED_IMAGE_NAME = 'combined-image'
        COMBINED_CONTAINER_NAME = 'combined-container'
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
                        
                        // 构建并启动容器（后台模式）
                        sh "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} up --build -d"
                    } else {
                        // 停止并删除任何现有的容器
                        powershell "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} down"
                        
                        // 构建并启动容器（后台模式）
                        powershell "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} up --build -d"
                    }
                }
            }
        }

        stage('Commit Containers to Images') {
            steps {
                script {
                    if (isUnix()) {
                        // 获取运行中的容器ID
                        def frontendContainerId = sh(script: "docker ps -q --filter 'name=frontend'", returnStdout: true).trim()
                        def backendContainerId = sh(script: "docker ps -q --filter 'name=web'", returnStdout: true).trim()
                        def phpmyadminContainerId = sh(script: "docker ps -q --filter 'name=phpmyadmin'", returnStdout: true).trim()
                        def databaseContainerId = sh(script: "docker ps -q --filter 'name=mysql-container'", returnStdout: true).trim()

                        // 提交容器为新镜像
                        if (frontendContainerId && backendContainerId && phpmyadminContainerId && databaseContainerId) {
                            sh "docker commit ${frontendContainerId} ${env.COMBINED_IMAGE_NAME}"
                            sh "docker commit ${backendContainerId} ${env.COMBINED_IMAGE_NAME}"
                            sh "docker commit ${phpmyadminContainerId} ${env.COMBINED_IMAGE_NAME}"
                            sh "docker commit ${databaseContainerId} ${env.COMBINED_IMAGE_NAME}"
                        }
                    } else {
                        // 获取运行中的容器ID
                        def frontendContainerId = powershell(returnStdout: true, script: "docker ps -q --filter 'name=frontend'").trim()
                        def backendContainerId = powershell(returnStdout: true, script: "docker ps -q --filter 'name=web'").trim()
                        def phpmyadminContainerId = powershell(returnStdout: true, script: "docker ps -q --filter 'name=phpmyadmin'").trim()
                        def databaseContainerId = powershell(returnStdout: true, script: "docker ps -q --filter 'name=mysql-container'").trim()

                        // 提交容器为新镜像
                        if (frontendContainerId && backendContainerId && phpmyadminContainerId && databaseContainerId) {
                            powershell "docker commit ${frontendContainerId} ${env.COMBINED_IMAGE_NAME}"
                            powershell "docker commit ${backendContainerId} ${env.COMBINED_IMAGE_NAME}"
                            powershell "docker commit ${phpmyadminContainerId} ${env.COMBINED_IMAGE_NAME}"
                            powershell "docker commit ${databaseContainerId} ${env.COMBINED_IMAGE_NAME}"
                        }
                    }
                }
            }
        }

        stage('Run Committed Image') {
            steps {
                script {
                    if (isUnix()) {
                        // 停止并删除任何现有的容器
                        sh "docker rm -f ${env.COMBINED_CONTAINER_NAME} || true"
                        
                        // 启动新的容器
                        sh "docker run -d --name ${env.COMBINED_CONTAINER_NAME} -p 80:80 -p 8000:8000 -p 8080:8080 -p 3306:3306 ${env.COMBINED_IMAGE_NAME}"
                    } else {
                        // 停止并删除任何现有的容器
                        powershell "docker rm -f ${env.COMBINED_CONTAINER_NAME} || true"
                        
                        // 启动新的容器
                        powershell "docker run -d --name ${env.COMBINED_CONTAINER_NAME} -p 80:80 -p 8000:8000 -p 8080:8080 -p 3306:3306 ${env.COMBINED_IMAGE_NAME}"
                    }
                }
            }
        }
    }
}
