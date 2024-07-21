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
                        //删除所有容器
                        powershell "docker rm \$(docker ps -a -q) -f"
                      

                        
                        // 构建并启动容器（后台模式）
                        powershell "docker-compose up --build -d"

                        //删除未使用的镜像
                        powershell "docker rmi \$(docker images -f dangling=true -q) -f"

                    }
                }
            }
        }
        
    }

}
