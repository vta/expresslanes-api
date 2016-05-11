'use strict';

const http = require('http')
  , util = require('util')
  , cmd = require('node-cmd');


var API_HOST = '54.218.16.105';
var UPDATE_INTERVAL = 5*60*1000;  // five minutes
var FALLBACK_INTERVAL = 2*1000; // 2 seconds
var next_update_in_ms = 0;


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
  cmd.get(
        'sqlcmd.exe -S "VTA00DB01" -d DMS -Q "DMS.dbo.uspGetSignMessageCurrent"',
        function(data){
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




console.log('Running...');
pulse();