pipeline {
    agent {
        dockerfile {
            filename 'docker/dockerfile-hugo'
            additionalBuildArgs '--build-arg JENKINS_USER_ID=`id -u jenkins` --build-arg JENKINS_GROUP_ID=`id -g jenkins`'
        }
    }
    
    stages {
        stage('Test') {
            steps {
                sh 'hugo -s src -d ../target'
            }
        }
    }
}
