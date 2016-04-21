'use strict';

const express = require('express')
	, Ajv = require('ajv')
	, bodyParser = require('body-parser')
	, util = require('util')
	, app = express();

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
        "type": ["string","null"]
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

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


var ajv = Ajv();
var validate = ajv.compile(tollSchema);

var tolldata = [];

app.get('/', function (req, res) {
  res.json(tolldata);
});


app.put('/', function (req, res) {
  var response = [];
  
  if (!req.body){
  	res.send(util.inspect(req)+'\n');
  	return;
  }

  var valid = validate(req.body);
  if (!valid){
  	console.log('POST : data is not valid.');
  	res.json(400, { error: validate.errors });
  }

  tolldata = req.body;
  res.status(200).end();
});


app.listen(PORT);
console.log('Running on http://localhost:' + PORT);