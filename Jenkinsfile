pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        DOCKER_COMPOSE_PROJECT_NAME = 'capstone-project'
        IMAGE_NAME = 'my-image'
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
                    }
                }
            }
        }

        stage('Commit Containers to Images') {
            steps {
                script {
                    if (isUnix()) {
                        // 获取要提交的容器ID
                        def containerId = sh(script: "docker ps -q --filter 'name=web-1'", returnStdout: true).trim()
                        if (containerId) {
                            sh "docker commit ${containerId} ${env.IMAGE_NAME}"
                        }
                    } else {
                        // 获取要提交的容器ID
                        def containerId = powershell(returnStdout: true, script: "docker ps -q --filter 'name=${env.DOCKER_COMPOSE_PROJECT_NAME}'").trim()
                        if (containerId) {
                            powershell "docker commit ${containerId} ${env.IMAGE_NAME}"
                        }
                        //停止现有容器down
                        powershell "docker-compose down"
                        //等待5秒
                        sleep 5

                        //启动image 80端口 8080端口 8000端口 3306端口
                        powershell "docker run -d -p 80:80 -p 8080:8080 -p 8000:8000 -p 3306:3306 ${env.IMAGE_NAME}"

                    }
                }
            }
        }
    }
}
