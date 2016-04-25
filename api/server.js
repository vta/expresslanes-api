'use strict';

const express = require('express')
	, Ajv = require('ajv')
	, bodyParser = require('body-parser')
	, util = require('util')
	, cors = require('cors')
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

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());


var ajv = Ajv();
var validate = ajv.compile(tollSchema);

var tolldata = [];

app.get('/', function (req, res) {
  res.json(tolldata);
});


app.put('/', function (req, res) {
  var response = [];
  
  var valid = validate(req.body);
  if (!valid){
  	res.status(400).json({ error: validate.errors });
  	return;
  }

  tolldata = req.body;
  res.status(200).end();
});


app.listen(PORT);
console.log('Running on http://localhost:' + PORT);