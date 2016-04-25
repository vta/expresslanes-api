'use strict';

const http = require('http')
	, util = require('util');


var API_HOST = '54.218.16.105';
var UPDATE_INTERVAL = 5*60*1000;  // five minutes
var FALLBACK_INTERVAL = 2*1000; // 2 seconds
var next_update_in_ms = 0;



function getData(){
  // TODO: get this from the database

  function getRandomTollAmount(){
      var cents_ones = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
      var cents_tens = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
      var dollars_ones = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
      return  dollars_ones +  '.' + cents_tens + cents_ones;
  }

  return [
    {
      "Plaza_Name": "CLW",
      "Interval_Starting": (new Date()).getTime(),
      "Pricing_Module": getRandomTollAmount(),
      "Message_Module": "HOV 2+ NO TOLL"
    },
    {
      "Plaza_Name": "FSW",
      "Interval_Starting": (new Date()).getTime(),
      "Pricing_Module": getRandomTollAmount(),
      "Message_Module": "HOV 2+ NO TOLL"
    }
  ];
}



function sendData(data){
  var body = JSON.stringify(data);

  var request = new http.ClientRequest({
      host: API_HOST,
      port: 80,
      path: "/",
      method: "PUT",
      "agent":false,
      headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body)
      }
  });

  request.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  request.on('response', function(response){
    if (response.statusCode === 200){
      console.log('response: OK');
    }
    if (response.statusCode === 400){
      console.log('response from server : ', response.statusCode, response.statusMessage);
    }

  });
  console.log(body);
  request.end(body);
}



function pulse(){
  console.log('getting data');
  var data = getData();

  // get new data five minutes from the time given
  next_update_in_ms = (data[0]['Interval_Starting'] + UPDATE_INTERVAL) - ((new Date().getTime()));
  if (next_update_in_ms < 0) {
    // if for some reason the data is old, then try again in 2 seconds.
    next_update_in_ms = FALLBACK_INTERVAL;
  }

  sendData(data);

  console.log('Next update in '+next_update_in_ms+' milliseconds');
  setTimeout(pulse, next_update_in_ms);
}



console.log('Running...');
pulse();