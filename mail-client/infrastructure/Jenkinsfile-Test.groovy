pipeline {
    agent any

    environment {
        DOCKER_PROJECT_NAME = "software.bz.it.mail-client"
        DOCKER_IMAGE = '755952719952.dkr.ecr.eu-west-1.amazonaws.com/software.bz.it.mail-client'
        DOCKER_TAG = "test-$BUILD_NUMBER"

		SERVER_PORT = "1013"

        SMTP_USER=credentials('software.bz.it.smtp.auth.user')
        SMTP_PASSWORD=credentials('software.bz.it.smtp.auth.password')
        MAIL_FROM=credentials('software.bz.it.mail.from')
        MAIL_TO=credentials('software.bz.it.mail.to')
    }

    stages {
        stage('Configure') {
            steps {
                sh """
                    cd mail-client
                    rm -f .env
                    echo '' > .env
                    echo 'COMPOSE_PROJECT_NAME=${DOCKER_PROJECT_NAME}' >> .env
                    echo 'DOCKER_IMAGE=${DOCKER_IMAGE}' >> .env
                    echo 'DOCKER_TAG=${DOCKER_TAG}' >> .env

					echo 'SERVER_PORT=${SERVER_PORT}' >> .env
                """
                
                sh '''jq '.serverConfig.auth.user="'${SMTP_USER}'"' mail-client/config.json > tmpFile && mv tmpFile mail-client/config.json'''
                sh '''jq '.serverConfig.auth.pass="'${SMTP_PASSWORD}'"' mail-client/config.json > tmpFile && mv tmpFile mail-client/config.json'''
                sh '''jq '.mailOptions.from="'${MAIL_FROM}'"' mail-client/config.json > tmpFile && mv tmpFile mail-client/config.json'''
                sh '''jq '.mailOptions.to="'${MAIL_TO}'"' mail-client/config.json > tmpFile && mv tmpFile mail-client/config.json'''
            }
        }
        stage('Build') {
            steps {
                sh '''
                    aws ecr get-login --region eu-west-1 --no-include-email | bash
                    docker-compose --no-ansi -f mail-client/infrastructure/docker-compose.build.yml build --pull
                    docker-compose --no-ansi -f mail-client/infrastructure/docker-compose.build.yml push
                '''
            }
        }
        stage('Deploy') {
            steps {
               sshagent(['jenkins-ssh-key']) {
                    sh """
                        cd mail-client
                        (cd infrastructure/ansible && ansible-galaxy install -f -r requirements.yml)
                        (cd infrastructure/ansible && ansible-playbook --limit=test deploy.yml --extra-vars "release_name=${BUILD_NUMBER}")
                    """
                }
            }
        }
    }
}
