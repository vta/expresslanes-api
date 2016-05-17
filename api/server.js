'use strict';

const express = require('express')
  , app = express()
  , Ajv = require('ajv')
  , bodyParser = require('body-parser')
  , util = require('util')
  , fs = require('fs')
  , cors = require('cors')
  , path = require('path')
  , NodeRSA = require('node-rsa')
  , server = require('http').createServer(app)
  , io = require('socket.io')(server);

// Constants
const PORT = 8080;


var tollSchema = {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "Plaza_Name": {
        "type": ["string"]
      },
      "Interval_Starting": {
        "type": ["integer","null"]
      },
      "Pricing_Module": {
        "type": ["string","null"]
      },
      "Message_Module": {
        "type": ["string","null"]
      }
    },
    "required": [
      "Plaza_Name", "Interval_Starting", "Pricing_Module", "Message_Module"
    ]
  }
};



app.use(bodyParser.json());
app.use(cors());


var key_data = fs.readFileSync('expresslanesapi.key.pem', 'utf8');
var privatekey = new NodeRSA(key_data);


var ajv = Ajv();
var validate = ajv.compile(tollSchema);

var tolldata = [];

app.get('/', function (req, res) {
   res.json(tolldata);
 });


app.put('/', function (req, res, next) {

  var received = req.body['tolls'];
  console.log('PUT received: ', received);
  received = privatekey.decrypt(received, 'json');
  console.log('decrypted to: ', received);



  var valid = validate(received);
  if (!valid){
    res.status(400).json({ error: validate.errors });
    return;
  }

  tolldata = received;
  io.emit('toll', tolldata);
  res.status(200).end();
});


io.on('connection', function(socket){
   socket.emit('toll', tolldata);
});
server.listen(PORT);

console.log('Running on http://localhost:' + PORT);