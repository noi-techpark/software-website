pipeline {
    agent any

    parameters {
        string(name: 'TAG', defaultValue: '1.0.0', description: 'Docker Image Tag')
    }

    environment {
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        DOCKER_IMAGE_APP = "755952719952.dkr.ecr.eu-west-1.amazonaws.com/software.bz.it.mail-client"
        DOCKER_TAG_APP = "test-$BUILD_NUMBER"
        DOCKER_SERVICES = "app"
        DOCKER_SERVER_IP = "63.33.73.203"
        DOCKER_SERVER_DIRECTORY = "/var/docker/software.bz.it.mail-client"
        SMTP_USER=credentials('software.bz.it.smtp.auth.user')
        SMTP_PASSWORD=credentials('software.bz.it.smtp.auth.password')
        MAIL_FROM=credentials('software.bz.it.mail.from')
        MAIL_TO=credentials('software.bz.it.mail.to')
    }

    stages {
        stage('Configure') {
            steps {
                sh "echo '' > .env"
                sh "echo 'DOCKER_IMAGE_APP=${DOCKER_IMAGE_APP}' >> .env"
                sh "echo 'DOCKER_TAG_APP=${DOCKER_TAG_APP}' >> .env"
                sh '''jq '.serverconfig.auth.user="'${SMTP_USER}'"' mail-client/config.json > tmpFile && mv tmpFile mail-client/config.json'''
                sh '''jq '.serverconfig.auth.user="'${SMTP_PASSWORD}'"' mail-client/config.json > tmpFile && mv tmpFile mail-client/config.json'''
                sh '''jq '.serverconfig.auth.user="'${SMTP_USER}'"' mail-client/config.json > tmpFile && mv tmpFile mail-client/config.json'''
                sh '''jq '.mailOptions.from="'${MAIL_FROM}'"' mail-client/config.json > tmpFile && mv tmpFile mail-client/config.json'''
                sh '''jq '.mailOptions.to="'${MAIL_TO}'"' mail-client/config.json > tmpFile && mv tmpFile mail-client/config.json'''
            }
        }
        stage('Build & Push') {
            steps {
                sh "aws ecr get-login --region eu-west-1 --no-include-email | bash"
                sh "cd mail-client && docker-compose -f docker-compose.yml -f docker-compose.build.yml build ${DOCKER_SERVICES}"
                sh "cd mail-client && docker-compose -f docker-compose.yml -f docker-compose.build.yml push ${DOCKER_SERVICES}"
            }
        }
        stage('Deploy') {
            steps {
                sshagent(['jenkins-ssh-key']) {
                    sh """ssh -o StrictHostKeyChecking=no ${DOCKER_SERVER_IP} 'AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}" AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}" bash -c "aws ecr get-login --region eu-west-1 --no-include-email | bash"'"""

                    sh "ssh -o StrictHostKeyChecking=no ${DOCKER_SERVER_IP} 'ls -1t ${DOCKER_SERVER_DIRECTORY}/releases/ | tail -n +10 | grep -v `readlink -f ${DOCKER_SERVER_DIRECTORY}/current | xargs basename --` -- | xargs -r printf \"${DOCKER_SERVER_DIRECTORY}/releases/%s\\n\" | xargs -r rm -rf --'"
                
                    sh "ssh -o StrictHostKeyChecking=no ${DOCKER_SERVER_IP} 'mkdir -p ${DOCKER_SERVER_DIRECTORY}/releases/${BUILD_NUMBER}'"
                    sh "pv docker-compose.run.yml | ssh -o StrictHostKeyChecking=no ${DOCKER_SERVER_IP} 'tee ${DOCKER_SERVER_DIRECTORY}/releases/${BUILD_NUMBER}/docker-compose.yml'"
                    sh "pv .env | ssh -o StrictHostKeyChecking=no ${DOCKER_SERVER_IP} 'tee ${DOCKER_SERVER_DIRECTORY}/releases/${BUILD_NUMBER}/.env'"
                    sh "ssh -o StrictHostKeyChecking=no ${DOCKER_SERVER_IP} 'cd ${DOCKER_SERVER_DIRECTORY}/releases/${BUILD_NUMBER} && docker-compose pull'"

                    sh "ssh -o StrictHostKeyChecking=no ${DOCKER_SERVER_IP} '[ -d \"${DOCKER_SERVER_DIRECTORY}/current\" ] && (cd ${DOCKER_SERVER_DIRECTORY}/current && docker-compose down) || true'"
                    sh "ssh -o StrictHostKeyChecking=no ${DOCKER_SERVER_IP} 'ln -sfn ${DOCKER_SERVER_DIRECTORY}/releases/${BUILD_NUMBER} ${DOCKER_SERVER_DIRECTORY}/current'"
                    sh "ssh -o StrictHostKeyChecking=no ${DOCKER_SERVER_IP} 'cd ${DOCKER_SERVER_DIRECTORY}/current && docker-compose up --detach'"
                }
            }
	    }
    }
}
