pipeline {
    agent {
        dockerfile {
            filename 'mail-client/infrastructure/Dockerfile'
            additionalBuildArgs '--build-arg JENKINS_USER_ID=`id -u jenkins` --build-arg JENKINS_GROUP_ID=`id -g jenkins`'
        }
    }
    environment{
        HOME='.'
    }
    stages {
        stage('Dependencies') {
            steps {
                sh 'cd mail-client && npm install'
            }
        }
    }
}
