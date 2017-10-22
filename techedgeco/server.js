const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

var Mailjet = require('node-mailjet').connect('9feda41789e9286395690a59d99d6ef3', 'b6cb6b4f65610cb35aadcacbe35476c3');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    res.sendFile('index.html');
})

var db;
var transporter;

MongoClient.connect('mongodb://techedgeco:techedgeco@ds121965.mlab.com:21965/techedgeco-web', function(err, database){
    if (err) console.log(err);
    db = database;
    
    app.listen(3000, function() {
            console.log('listening on Port 3000');
        });
    })
    
    app.post('/contactus', function(req, res){
    console.log(req.body.name);
   
    var sendEmail = Mailjet.post('send');
    
    var emailData = {
        'FromEmail': 'mudaliarpradeep@gmail.com',
        'FromName': 'TechEdge Web',
        'Subject': 'New Customer Inquiry Submitted',
        'Text-part': 'Name: ' + req.body.name + '\n' + 'Email: ' + req.body.email + '\n' + 'Message: ' + req.body.message,
        'Recipients': [{'Email': 'prad.mud@gmail.com'}],
    }

    sendEmail
      .request(emailData)
        .catch(handleError);

    db.collection('contactus').save(req.body, function(err, result) {
        if (err) 
            console.log(err);
        else {
            console.log('Form saved to database');
        } 
           
        res.redirect('/');
    });
})
 
function handleError (err) {
    throw new Error(err.ErrorMessage);
}