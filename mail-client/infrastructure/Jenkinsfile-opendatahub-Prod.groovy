pipeline {
    agent any

    environment {
        DOCKER_PROJECT_NAME = "opendatahub.bz.it.mail-client"
        DOCKER_IMAGE = '755952719952.dkr.ecr.eu-west-1.amazonaws.com/opendatahub.bz.it.mail-client'
        DOCKER_TAG = "prod-$BUILD_NUMBER"

        SERVER_PORT = "1014"

        SMTP_PASSWORD=credentials('opendatahub.bz.it.smtp.auth.password')
    }

    stages {
        stage('Configure') {
            steps {
                sh """
                    cd mail-client
                    rm -f .env
                    echo 'COMPOSE_PROJECT_NAME=${DOCKER_PROJECT_NAME}' > .env
                    echo 'DOCKER_IMAGE=${DOCKER_IMAGE}' >> .env
                    echo 'DOCKER_TAG=${DOCKER_TAG}' >> .env

                    echo 'SERVER_PORT=${SERVER_PORT}' >> .env
                """

                sh '''jq '.serverConfig.auth.user="'no-reply@opendatahub.bz.it'"' mail-client/config.json > tmpFile && mv tmpFile mail-client/config.json'''
                sh '''jq '.serverConfig.auth.pass="'${SMTP_PASSWORD}'"' mail-client/config.json > tmpFile && mv tmpFile mail-client/config.json'''
                sh '''jq '.serverConfig.domains[0]="opendatahub.bz.it"' mail-client/config.json > tmpFile && mv tmpFile mail-client/config.json'''
                sh '''jq '.mailOptions.from="no-reply@opendatahub.bz.it"' mail-client/config.json > tmpFile && mv tmpFile mail-client/config.json'''
                sh '''jq '.mailOptions.to="l.miotto@noi.bz.it"' mail-client/config.json > tmpFile && mv tmpFile mail-client/config.json'''
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
                        (cd infrastructure/ansible && ansible-playbook --limit=prod deploy.yml --extra-vars "release_name=${BUILD_NUMBER} project_name=${DOCKER_PROJECT_NAME}")
                    """
                }
            }
        }
    }
}
