# VTA Express Lanes API

This API was written as a [Dockerized Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/).

To build the docker image:

    $ docker build -t vta/expresslanes_api .

To run the built image:

    $ docker run -p 49160:8080 -d vta/expresslanes_api


To test if it is working:

    $ curl -i localhost:49160



To push express lanes data to the API:
### cURL
```
    
    curl -X PUT -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '[
      {
        "Plaza_Name": "CLW",
        "Interval_Starting": "2015-11-02 16:05:00.000",
        "Pricing_Module": "0.55",
        "Message_Module": "HOV 2+ NO TOLL"
      },
      {
        "Plaza_Name": "FSW",
        "Interval_Starting": "2015-11-02 16:05:00.000",
        "Pricing_Module": "1.80",
        "Message_Module": "HOV 2+ NO TOLL"
      }
    ]' "http://localhost:49160"
```

### HTTP
```
    PUT  HTTP/1.1
    Host: localhost:49160
    Content-Type: application/json
    Cache-Control: no-cache
    
    [
      {
        "Plaza_Name": "CLW",
        "Interval_Starting": "2015-11-02 16:05:00.000",
        "Pricing_Module": "0.55",
        "Message_Module": "HOV 2+ NO TOLL"
      },
      {
        "Plaza_Name": "FSW",
        "Interval_Starting": "2015-11-02 16:05:00.000",
        "Pricing_Module": "1.80",
        "Message_Module": "HOV 2+ NO TOLL"
      }
    ]
```

Expected result should be an empty 200 response.

If the data is not formed correctly, a 400 response will be given and an error object will be returned showing the error.

Example:
```
{
  "error": [
    {
      "keyword": "required",
      "dataPath": "[1]",
      "schemaPath": "#/items/required",
      "params": {
        "missingProperty": "Message_Module"
      },
      "message": "should have required property 'Message_Module'"
    }
  ]
}
```



## Development

To run in development: `node server.js`



## To Do:

 * validate against public/private keys or JSON Web Tokens to verify the data pushed to this proxy/API comes from a trusted source.
 * write some unit tests to verify functionality
 * maybe implement caching (if needed)
