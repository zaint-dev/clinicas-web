pipeline {
    agent {
        docker {
            image 'node:20.18'
        }
    }
    environment {
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id-zaint')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key-zaint')
        BUCKET_NAME = 'angular-app-bucket-vnsa3i'
        DISTRIBUTION_ID = credentials('cloudfront-distribution-id-zaint')
    }
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install --legacy-peer-deps'
            }
        }
        stage('Build Angular') {
            steps {
                sh 'npm run build:prod'
            }
        }
        stage('Upload to S3') {
            agent {
                docker {
                    image 'amazon/aws-cli'
                    args '--entrypoint=""'
                }
            }
            steps {
                script {
                    echo "Uploading Angular app to S3 bucket: ${BUCKET_NAME}"
                    sh """
                    aws s3 sync dist/vuexy/ s3://${BUCKET_NAME} --delete
                    """
                }
            }
        }
        stage('Invalidate CloudFront Cache') {
            agent {
                docker {
                    image 'amazon/aws-cli'
                    args '--entrypoint=""'
                }
            }
            steps {
                script {
                    echo "Invalidating CloudFront cache"
                    sh """
                    aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths "/*"
                    """
                }
            }
        }
        
    }
    post {
        always {
            cleanWs()
        }
    }
}