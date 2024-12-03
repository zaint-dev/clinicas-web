pipeline {
    agent any
    environment {
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        BUCKET_NAME = 'angular-app-bucket-vnsa3i'
        DISTRIBUTION_ID = credentials('cloudfront-distribution-id')
        SONAR_HOST_URL = 'http://ec2-34-201-94-13.compute-1.amazonaws.com:9000' 
        SONAR_LOGIN = credentials('sonar-token-angular')
        HOME = '/tmp'
    }
    stages {
        stage('Build & Test Angular') {
            agent {
                docker {
                    image 'node:22-alpine'
                }
            }
            stages {
                stage('Install Dependencies') {
                    steps {
                        sh 'npm cache clean -force'
                        sh 'rm -rf node_modules package-lock.json'
                        echo "Installing dependencies..."
                        sh 'npm install --legacy-peer-deps --cache /tmp/.npm'
                    }
                }
                stage('Build Angular App') {
                    steps {
                        echo "Building Angular app in production mode..."
                        sh 'npm run build:prod'
                        stash includes: 'dist/vuexy/**', name: 'angular-build'
                    }
                }
            }
        }
        stage('Run Tests') {
            agent {
                docker {
                    image 'popckorn/node22-chrome:latest'
                    args '--shm-size=2g'
                }
            }
            environment {
                CHROME_BIN = '/usr/bin/chromium-browser'
                XDG_CACHE_HOME= '/tmp/.chromium'
                XDG_CONFIG_HOME= '/tmp/.chromium'
            }
            steps {
                echo "Running tests..."
                sh 'npm cache clean -force'
                sh 'rm -rf node_modules package-lock.json'
                sh 'npm install --legacy-peer-deps --cache /tmp/.npm'
                echo "Running tests..."
                sh 'npm run test'
            }
        }
        stage('SonarQube Analysis') {
            agent {
                docker {
                    image 'sonarsource/sonar-scanner-cli:latest'
                }
            }
            steps {
                echo "Running SonarQube analysis..."
                sh """
                sonar-scanner \
                  -Dsonar.projectKey=clinicas-dialisis-web \
                  -Dsonar.sources=. \
                  -Dsonar.host.url=$SONAR_HOST_URL \
                  -Dsonar.login=$SONAR_LOGIN \
                  -Dsonar.userHome=/tmp/.sonar
                """
            }
        }
        stage('Upload to S3 & Invalidate Cache') {
            agent {
                docker {
                    image 'amazon/aws-cli'
                    args '--entrypoint=""'
                }
            }
            stages {
                stage('Prepare S3 Upload') {
                    steps {
                        script {
                            echo "Preparing to upload to S3..."
                            unstash 'angular-build'
                            sh 'ls -alh dist/vuexy/'
                        }
                    }
                }
                stage('Upload to S3') {
                    steps {
                        echo "Uploading Angular app to S3 bucket: ${BUCKET_NAME}..."
                        sh """
                        aws s3 sync dist/vuexy/ s3://${BUCKET_NAME} --delete
                        """
                    }
                }
                stage('Invalidate CloudFront Cache') {
                    steps {
                        sh 'aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"'
                    }
                }
            }
        }
    }
    post {
        success {
            withCredentials([string(credentialsId: 'discord-webhook-url', variable: 'DISCORD_WEBHOOK')]) {
                discordSend description: '✅ Build completado con éxito.', 
                            footer: 'Clinica Dialisis Frontend', 
                            link: env.BUILD_URL, 
                            result: currentBuild.currentResult, 
                            title: env.JOB_NAME, 
                            webhookURL: DISCORD_WEBHOOK
            }
        }
        failure {
            withCredentials([string(credentialsId: 'discord-webhook-url', variable: 'DISCORD_WEBHOOK')]) {
                discordSend description: '❌ Build fallido.', 
                            footer: 'Clinicas Dialisis Frontend', 
                            link: env.BUILD_URL, 
                            result: currentBuild.currentResult, 
                            title: env.JOB_NAME, 
                            webhookURL: DISCORD_WEBHOOK
            }
        } 
    }
}