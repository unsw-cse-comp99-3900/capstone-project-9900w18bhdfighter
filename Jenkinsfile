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
                        
                        // 构建并启动容器（后台模式）
                        sh "docker-compose -f ${env.DOCKER_COMPOSE_FILE} -p ${env.DOCKER_COMPOSE_PROJECT_NAME} up --build -d"
                    } else {
                            // 停止并删除任何现有的容器
                            powershell "docker-compose down"
                            
                            // 获取所有容器ID
                            def containers = powershell(returnStdout: true, script: "docker ps -a -q").trim()
                            
                            // 如果有容器，删除它们
                            if (containers) {
                                powershell "docker rm \$(docker ps -a -q) -f"
                            }

                            // 构建并启动容器（后台模式）
                            powershell "docker-compose up --build -d"

                            // 获取未使用的image ID
                            def unusedImages = powershell(returnStdout: true, script: "docker images -q --filter \"dangling=true\" --filter \"label!=inuse\"").trim()
                            
                            // 如果有未使用的image，删除它们
                            if (unusedImages) {
                                powershell "docker rmi \$(docker images -q --filter \"dangling=true\" --filter \"label!=inuse\")"
                            }
                    }
                }
            }
        }
        
    }

}
