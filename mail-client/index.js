'user strict';

var express = require("express");
var nodemailer = require('nodemailer');
var cors = require('cors')
const fs = require('fs');
const bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

let config = JSON.parse(fs.readFileSync('config.json')); 

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

app.post('/book-service',function(request,response){
    if (!isValidRequest(request)){
        response.status(400).send("You shall not pass");
    }
    else{
        console.log("Service request starts now");
        config.mailOptions.subject = "Service request from "+request.body.email;
        config.mailOptions.text = createServiceMail(request.body);
        transporter.sendMail(config.mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
        response.send("Service request completed");
    }
});

app.post('/contact',function(request,response){
    if (!isValidRequest(request)){
        console.log("this body failed"+request.body);
        response.status(400).send("You shall not pass");
    }
    else{
        transporter.sendMail(config.mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
        });
        response.send("Contact request completed");
    }
});

var transporter = nodemailer.createTransport(config.serverConfig);
var isValidRequest = function(req){
   //return req.headers['Referer'] === "freesoftwarelab.noi.bz.it";
    return req.body.email && req.body.name && req.body.surname;
}
var createServiceMail = function(b){
    var text = '';
    text += b.name + ' ' + b.surname + '\n';
    text += (b.company===undefined) ? '' : (b.company + '\n');
    text += b.email + ' ' + b.phone + '\n';
    text += b.date1 + ', ' + b.date2 + ', ' + b.date3;
    return text;
}
var createContactMail =function(b){
    var text = '';
    text += b.name + ' ' + b.surname + '\n';
    text += (b.company===undefined) ? '' : (b.company + '\n');
    text += b.email + ' ' + b.phone||'' + '\n';
    text += b.message;
    return text;
}
