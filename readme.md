# VTA Express Lanes API

An API for accessing the dynamic toll values for the [VTA Silicon Valley Express Lanes](http://www.vta.org/projects-and-programs/highway/silicon-valley-express-lanes).

![screenshot of example.html in action](screenshot.png?raw=true "screenshot")

## Development

This API was written as a [Dockerized Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/).

## API

### Usage

The `example.html` file demonstrates the usage of this API, and uses the `Interval_Starting` property to calculate the time at which the next request should be made, since data is updated in 5 minute intervals.

With the server running locally, the `GET` and `PUT` operations are supported to get and set the data. Tools such as [cURL](https://curl.haxx.se/) or [Postman are](https://www.getpostman.com/) recommended for testing.

Both requests and responses should be made with Content-Type as `application/json; charset=utf-8`.

### GET /
#### request
    curl -X GET -H "Cache-Control: no-cache" -H "Postman-Token: "http://localhost:8080"

#### response
The response should be HTTP 200 (OK), and something like the following in the body:
```
[{"Plaza_Name":"CLW","Interval_Starting":"2015-11-02 16:05:00.000","Pricing_Module":"0.60","Message_Module":"HOV 2+ NO TOLL"},{"Plaza_Name":"FSW","Interval_Starting":"2015-11-02 16:05:00.000","Pricing_Module":"1.80","Message_Module":"HOV 2+ NO TOLL"}]
```

### PUT /
#### request
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

#### response
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



### Running in development
```
$ npm install
$ node server.js
```

### Running as a docker container

To build the docker image:

    $ docker build -t vta/expresslanes_api .

To run the built image:

    $ docker run -p 49160:8080 -d vta/expresslanes_api



## To Do:

 * validate against public/private keys or JSON Web Tokens to verify the data pushed to this proxy/API comes from a trusted source.
 * write some unit tests to verify functionality
 * maybe implement caching (if needed)
