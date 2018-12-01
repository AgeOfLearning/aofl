pipeline {
  agent any

    stages {
      stage('Install Dependencies') {
        steps {
          sh "cd aofl-js-packages && npm ci"
        }
      }
      stage('Lint') {
        steps {
          withCredentials([usernamePassword(credentialsId: 'sauce', usernameVariable: 'SAUCE_USERNAME', passwordVariable: 'SAUCE_ACCESS_KEY')]) {
            sh 'cd aofl-js-packages && npm run lint'
            }
          }
      }
      stage('Unit Test') {
        steps {
          withCredentials([usernamePassword(credentialsId: 'sauce', usernameVariable: 'SAUCE_USERNAME', passwordVariable: 'SAUCE_ACCESS_KEY')]) {
            sh 'cd aofl-js-packages && npm test'
          }
        }
      }
    }
}
