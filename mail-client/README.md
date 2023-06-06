<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->

Minimal mail client to send form data through mailgun
========================================================

## Requisits
- node.js //tested with 12.13.1
- Epxress.js //for the rest API
- Nodemailer //to send mails

## Setup
To install needed dependencies use npm:
`npm install`
Once configured you can easily run the app doing:
`node index.js` //will run by default on port 3000

## Configuration
To be able to run the app you need to configure the mail client and create a mail template.
Under config json you will find a default config similar to this:
```
{
    "serverConfig" : {
        "host" : "smtp.eu.mailgun.org",
        "port" : 465,
        "secure" : true,
        "domains":["software.bz.it"],
        "auth":{
            "user":"",
            "pass":""
        }
    },
    "mailOptions" : {
        "from": "from@domain.com",
        "to": "to@domain.com",
        "subject": "Default subject",
        "text": "DefaultText"
    }
}
```
adapt the configuration to your smtp server. You can follow the guide provided by nodemailer(https://nodemailer.com/smtp/)

