pipeline {
  agent any
  stages {
    stage('upload') {
      steps {
        s3Upload(bucket: 'it.bz.freesoftwarelab', acl: 'PublicRead', file: './src')
      }
    }
  }
  environment {
    AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
  }
}
