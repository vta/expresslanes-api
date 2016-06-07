# Client Examples

 * [Web](#web)
 * [Android](#android)

## <a name="web"></a>Web
The API supports both web sockets and AJAX calls, so there are example web pages here dealing with both. Both examples are using jquery only for convience in building the displayed result and making the AJAX calls. The `buildSign` function returns HTML content ready to be displayed in on the page.



### WebSockets
Here's the gist of the websockets example, :
``` javascript
<script src="//code.jquery.com/jquery-1.12.0.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.6/socket.io.min.js"></script>
<script>
  //<![CDATA[
    var API_ENDPOINT = 'http://ec2-54-218-16-105.us-west-2.compute.amazonaws.com';
    var socket = io(API_ENDPOINT);
    socket.on('toll', function(data){
          $('#output-sockets').empty();
          for (var i=0; i < data.length; i++){
              var sign = buildSign(data[i]['Plaza_Name'], data[i]['Pricing_Module'], data[i]['Message_Module']);
                  sign.appendTo($('#output-sockets'));
          }
    });
  //]]>
</script>
```


### AJAX implementation
The AJAX implementation is a bit more difficult because of the added timing complexity. The data updates every 6 minutes, so the `Interval_Starting` value in the data returned by the server should be used to calculate the timing offset to the next 6 minute update. This is done with the following calculation:

``` javascript
update_in_ms = (data[0]['Interval_Starting'] + UPDATE_INTERVAL) - ((new Date().getTime()));
```

Here's the rest of the code:

``` javascript
<script src="//code.jquery.com/jquery-1.12.0.min.js"></script>
<script type="text/javascript">
  //<![CDATA[
    var API_ENDPOINT = 'http://ec2-54-218-16-105.us-west-2.compute.amazonaws.com';
    var UPDATE_INTERVAL = 6*60*1000 + 400;  // 5 minutes + latency allowance
    var FALLBACK_INTERVAL = 10*1000;  // 2 seconds
    var update_in_ms = 0;
    function fetch(){
        window.console.log('getting data');
        $.get(API_ENDPOINT)
        .done(function(data){
            if (!data || !data.length || data.length < 1){
                $('#output-ajax').text('no data!');
                return;
            }
            $('#output-ajax').empty();
            // get new data five minutes from the time given
            update_in_ms = (data[0]['Interval_Starting'] + UPDATE_INTERVAL) - ((new Date().getTime()));
            if (update_in_ms < 0) {
                // if for some reason the data is old, then try again in 10 seconds.
                update_in_ms = FALLBACK_INTERVAL;
            }
            data.sort(function(a, b){ return a['Plaza_Name'] > b['Plaza_Name']});
            for (var i=0; i < data.length; i++){
                var sign = buildSign(data[i]['Plaza_Name'], data[i]['Pricing_Module'], data[i]['Message_Module']);
                sign.appendTo($('#output-ajax'));
            }
            window.console.log('Next update in '+update_in_ms+' milliseconds');
            
            $('<p>').text('Last updated at '+(new Date()).toLocaleTimeString()).appendTo('#output-ajax');
            $('<p>').text('Next update at '+(new Date(new Date().getTime() + update_in_ms)).toLocaleTimeString()).appendTo('#output-ajax');
            setTimeout(fetch, update_in_ms);
        });
    }
    (function() {
        setTimeout(fetch, update_in_ms);
    })();
  //]]>
</script>
```

## <a name="android"></a>Android
An example for Android has also been written that demonstrates reading from the web sockets interface (using [socket.io's library](https://github.com/socketio/socket.io-client-java)). That project is in the [SVELive-Android repository](https://github.com/vta/SVELive-Android).
