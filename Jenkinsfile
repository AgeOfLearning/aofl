pipeline {
  agent {
    dockerfile {
      dir 'Dockerfolder/node'
    }
  }
  stages {
    stage('Install Dependencies') {
      steps {
        sshagent(credentials: ['JenkinsSSH']) {
          sh 'printenv && cd aofl-js-packages && npm ci'
        }
      }
    }
    stage('Lint') {
      steps {
        withCredentials([string(credentialsId: 'SAUCE_USERNAME', variable: 'SAUCE_USERNAME'), string(credentialsId: 'SAUCE_ACCESS_KEY', variable: 'SAUCE_ACCESS_KEY')])  {
          sh 'cd aofl-js-packages && npm run lint'
        }
      }
    }
    stage('Unit Test') {
      steps {
        withCredentials([string(credentialsId: 'SAUCE_USERNAME', variable: 'SAUCE_USERNAME'), string(credentialsId: 'SAUCE_ACCESS_KEY', variable: 'SAUCE_ACCESS_KEY')])  {
          sh 'cd aofl-js-packages && npm test'
        }
      }
    }
  }
}
