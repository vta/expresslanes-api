# [API](https://github.com/vta/expresslanes-api/tree/master/api)

## Usage

The [example.html](http://rawgit.com/vta/expresslanes-api/master/example.html) file demonstrates the usage of this API, and uses the `Interval_Starting` property to calculate the time at which the next request should be made, since data is updated in 5 minute intervals.

`GET` and `PUT` operations are supported to get and set the data. Tools such as [cURL](https://curl.haxx.se/) or [Postman](https://www.getpostman.com/) are recommended for testing. Both requests and responses should be made with Content-Type as `application/json; charset=utf-8`.

## GET /
### request
```
curl -X GET -H "Cache-Control: no-cache" "http://localhost:8080"
````

### response
The response should be HTTP 200 (OK), and something like the following in the body:
```
[{"Plaza_Name":"CLW","Interval_Starting":"2015-11-02 16:05:00.000","Pricing_Module":"0.60","Message_Module":"HOV 2+ NO TOLL"},{"Plaza_Name":"FSW","Interval_Starting":"2015-11-02 16:05:00.000","Pricing_Module":"1.80","Message_Module":"HOV 2+ NO TOLL"}]
```

## PUT /
### request
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
]' "http://localhost:8080"
```

### response
Expected result should be an empty HTTP 200 (OK) response.

If the data is not formed correctly, a HTTP 400 (Bad Request) response will be given and an error object will be returned showing the error.

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

This API was written as a [Dockerized Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/).


### Running in development
```
$ npm install
$ node server.js
```

### Running as a docker container

To build the docker image:

    $ docker build -t scvta/vta-express-lanes-api .

To run the built image:

    $ docker run -d -p 8080:8080 scvta/vta-express-lanes-api:latest

