pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        DOCKER_COMPOSE_PROJECT_NAME = 'capstone-project'
        FRONTEND_IMAGE_NAME = 'frontend-image'
        BACKEND_IMAGE_NAME = 'backend-image'
        PHPMYADMIN_IMAGE_NAME = 'phpmyadmin-image'
        DATABASE_IMAGE_NAME = 'database-image'
        FRONTEND_CONTAINER_NAME = 'frontend-container'
        BACKEND_CONTAINER_NAME = 'backend-container'
        PHPMYADMIN_CONTAINER_NAME = 'phpmyadmin-container'
        DATABASE_CONTAINER_NAME = 'database-container'
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
                        
                        // 获取所有容器ID
                        def containers = sh(script: "docker ps -a -q", returnStdout: true).trim()
                        
                        // 如果有容器，删除它们
                        if (containers) {
                            sh "docker rm \$(docker ps -a -q) -f"
                        }
                        
                        // // 构建并启动容器（后台模式）
                        // sh "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} up --build -d"
                    } else {
                        // 停止并删除任何现有的容器
                        powershell "docker-compose down"
                        
                        // 获取所有容器ID
                        def containers = powershell(returnStdout: true, script: "docker ps -a -q").trim()
                        
                        // 如果有容器，删除它们
                        if (containers) {
                            powershell "docker rm \$(docker ps -a -q) -f"
                        }
                        
                        // // 构建并启动容器（后台模式）
                        // powershell "docker-compose up --build -d"
                    }
                }
            }
        }

        stage('Commit Containers to Images') {
            steps {
                script {
                    if (isUnix()) {
                        // 获取要提交的容器ID并提交为镜像
                        def frontendContainerId = sh(script: "docker ps -q --filter 'name=frontend-1'", returnStdout: true).trim()
                        if (frontendContainerId) {
                            sh "docker commit ${frontendContainerId} ${env.FRONTEND_IMAGE_NAME}"
                        }
                        
                        def backendContainerId = sh(script: "docker ps -q --filter 'name=web-1'", returnStdout: true).trim()
                        if (backendContainerId) {
                            sh "docker commit ${backendContainerId} ${env.BACKEND_IMAGE_NAME}"
                        }

                        def phpmyadminContainerId = sh(script: "docker ps -q --filter 'name=phpmyadmin'", returnStdout: true).trim()
                        if (phpmyadminContainerId) {
                            sh "docker commit ${phpmyadminContainerId} ${env.PHPMYADMIN_IMAGE_NAME}"
                        }

                        def databaseContainerId = sh(script: "docker ps -q --filter 'name=mysql-container'", returnStdout: true).trim()
                        if (databaseContainerId) {
                            sh "docker commit ${databaseContainerId} ${env.DATABASE_IMAGE_NAME}"
                        }
                    } else {
                        // 获取要提交的容器ID并提交为镜像
                        def frontendContainerId = powershell(returnStdout: true, script: "docker ps -q --filter 'name=frontend-1'").trim()
                        if (frontendContainerId) {
                            powershell "docker commit ${frontendContainerId} ${env.FRONTEND_IMAGE_NAME}"
                        }
                        
                        def backendContainerId = powershell(returnStdout: true, script: "docker ps -q --filter 'name=web-1'").trim()
                        if (backendContainerId) {
                            powershell "docker commit ${backendContainerId} ${env.BACKEND_IMAGE_NAME}"
                        }

                        def phpmyadminContainerId = powershell(returnStdout: true, script: "docker ps -q --filter 'name=phpmyadmin'").trim()
                        if (phpmyadminContainerId) {
                            powershell "docker commit ${phpmyadminContainerId} ${env.PHPMYADMIN_IMAGE_NAME}"
                        }

                        def databaseContainerId = powershell(returnStdout: true, script: "docker ps -q --filter 'name=mysql-container'").trim()
                        if (databaseContainerId) {
                            powershell "docker commit ${databaseContainerId} ${env.DATABASE_IMAGE_NAME}"
                        }
                    }
                }
            }
        }

        stage('Run Committed Images') {
            steps {
                script {
                    if (isUnix()) {
                        // 启动从镜像创建的容器
                        sh "docker run -d --name ${env.FRONTEND_CONTAINER_NAME} -p 80:80 ${env.FRONTEND_IMAGE_NAME}"
                        sh "docker run -d --name ${env.BACKEND_CONTAINER_NAME} -p 8000:8000 ${env.BACKEND_IMAGE_NAME}"
                        sh "docker run -d --name ${env.PHPMYADMIN_CONTAINER_NAME} -p 8080:8080 ${env.PHPMYADMIN_IMAGE_NAME}"
                        sh "docker run -d --name ${env.DATABASE_CONTAINER_NAME} -p 3306:3306 ${env.DATABASE_IMAGE_NAME}"
                    } else {
                        // 启动从镜像创建的容器
                        powershell "docker run -d --name ${env.FRONTEND_CONTAINER_NAME} -p 80:80 ${env.FRONTEND_IMAGE_NAME}"
                        powershell "docker run -d --name ${env.BACKEND_CONTAINER_NAME} -p 8000:8000 ${env.BACKEND_IMAGE_NAME}"
                        powershell "docker run -d --name ${env.PHPMYADMIN_CONTAINER_NAME} -p 8080:8080 ${env.PHPMYADMIN_IMAGE_NAME}"
                        powershell "docker run -d --name ${env.DATABASE_CONTAINER_NAME} -p 3306:3306 ${env.DATABASE_IMAGE_NAME}"
                    }
                }
            }
        }
    }
}
