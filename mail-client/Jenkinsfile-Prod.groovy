pipeline {
    agent {
        dockerfile {
            filename 'docker/dockerfile-node'
            additionalBuildArgs '--build-arg JENKINS_USER_ID=`id -u jenkins` --build-arg JENKINS_GROUP_ID=`id -g jenkins`'
        }
    }

    environment {
        SMTP_USER=credentialis('software.bz.it.smtp.auth.user')
        SMTP_PASSWORD=credentialis('software.bz.it.smtp.auth.password')
    }

    stages {
        stage('Dependencies & Build') {
            steps {
                sh 'npm install'
            }
        }
        /*TODO write tests before you execute them
        stage('Test') {
            steps {
                sh ''
            }
        }*/
        stage('Configure') {
            steps {
                sh 'jq \'.serverconfig.auth.user=${SMTP_USER}\' config.json > tmpFile && mv tmpFile config.json'
                sh 'jq \'.serverconfig.auth.pass=${SMTP_PASSWORD}\' config.json > tmpFile && mv tmpFile config.json'
            }
        }
        stage('Archive') {
            steps {
            }
        }
        stage('Deploy'){
            steps{
            }
        }
    }
}
