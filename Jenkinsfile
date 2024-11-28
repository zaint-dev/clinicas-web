pipeline {
    agent none
    environment {
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id-zaint')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key-zaint')
        BUCKET_NAME = 'angular-app-bucket-vnsa3i'
        DISTRIBUTION_ID = credentials('cloudfront-distribution-id-zaint')
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
                        echo "Invalidating CloudFront cache for distribution ID: ${DISTRIBUTION_ID}..."
                        sh """
                        aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths "/*"
                        """
                    }
                }
            }
        }
    }
    post {
        always {
            echo 'Cleaning up workspace...'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Ocurrion un error en el pipeline'
        }
    }
}