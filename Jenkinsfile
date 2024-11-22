pipeline {
    agent {
        docker {
            image 'node:20.18'
        }
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
    }
}