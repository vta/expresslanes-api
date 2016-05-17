'use strict';

const http = require('http')
  , util = require('util')
  , fs = require('fs')
  , NodeRSA = require('node-rsa')
  , cmd = require('node-cmd');

var next_update_in_ms = 0;
var FALLBACK_INTERVAL = 2*1000; // 2 seconds
var API_HOST = ['54.218.16.105', 80];
var UPDATE_INTERVAL = 6*60*1000;  // six minutes
//var API_HOST = ['localhost', 8080];
//var UPDATE_INTERVAL = 30*1000;  // 30 seconds


var key_data = fs.readFileSync('expresslanesapi.key.pub', 'utf8');
var publickey = new NodeRSA(key_data);


function parseSqlCmd(response){
  var lines = response.split('\n');
  var labels = lines[0].replace(/\s\s+/g, ' ').split(' ');
  // console.log('labels : ', labels);
  var split = lines[1].split(' ');
  var counts = [];
  for (var i=0; i < split.length; i++){
    counts.push(split[i].length);
  }
  var res = [];
  var label_index = 0;
  for (var i=2; i<lines.length; i++){
    var line = lines[i];
    var obj = {};
    
    var line_index = 0;
    // console.log(line, line.length);
    for (var j=0; j < counts.length; j++){
      var end = line_index+counts[j];
      var sliced = line.slice(line_index, end-1);
      obj[labels[label_index]] = sliced.trim();
      // console.log(labels[label_index]+' : '+obj[labels[label_index]]);
      line_index += counts[j]+1;
      label_index++;
    }
    res.push(obj);
    label_index = 0
  }
  res.pop();
  return res;
}

function pulse(){
  console.log('running stored procedure...');
  var this_update_in_ms = new Date().getTime();

  //var dummy = [
  //  {
  //    "biCalSeqID": "35897",
  //    "Plaza_Name": "FSE",
  //    "Interval_Starting": (new Date()).getTime(),
  //    "Pricing_Module": "1.90",
  //    "Message_Module": "HOV 2+ NO TOLL",
  //    "User": "SYSTEM",
  //    "Algorithm_Mode": "EL Speed"
  //  },
  //  {
  //    "biCalSeqID": "35897",
  //    "Plaza_Name": "CLW",
  //    "Interval_Starting": (new Date()).getTime(),
  //    "Pricing_Module": "1.80",
  //    "Message_Module": "HOV 2+ NO TOLL",
  //    "User": "SYSTEM",
  //    "Algorithm_Mode": "EL Speed"
  //  }
  //];
  //sendData(dummy);
  //return;

  cmd.get(
        'sqlcmd.exe -S "VTA00DB01" -d DMS -Q "DMS.dbo.uspGetSignMessageCurrent"',
        function(data){
          if (data.length === 0){
            console.error('Failed to run the SQL query.');
            return;
          }
          
          var data = parseSqlCmd(data);
          var clean_data = [];
          for (var i = 0; i < data.length; i++){
            var obj = data[i];
            obj['Interval_Starting'] = new Date(obj['Interval_Starting']).getTime();
            this_update_in_ms = obj['Interval_Starting'];
            clean_data.push(obj);
          }
          console.log('Got data that was updated at '+new Date(this_update_in_ms).toLocaleTimeString());
          sendData(clean_data);

          // get new data five minutes from the time given
          next_update_in_ms =  (this_update_in_ms + UPDATE_INTERVAL) - (new Date()).getTime();
          console.log('next update should be in '+next_update_in_ms+' ms (at '+new Date(next_update_in_ms + (new Date().getTime())).toLocaleTimeString()+')');
          if (next_update_in_ms < 0) {
            // if for some reason the data is old, then try again in 2 seconds.
            console.log('data was old; trying again in two seconds instead.');
            next_update_in_ms = FALLBACK_INTERVAL;
          }
          setTimeout(pulse, next_update_in_ms);
        }
    );
}



function sendData(data){

  var toll_data = JSON.stringify(data);
  
  console.log('data to encrypt: ', toll_data);
  toll_data = publickey.encrypt(toll_data, 'base64');
  console.log('encrypted to: ', toll_data);

  var body = JSON.stringify({"tolls" : toll_data});

  var request = new http.ClientRequest({
      host: API_HOST[0],
      port: API_HOST[1],
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


console.log('Running...');
pulse();