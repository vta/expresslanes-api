# [API](https://github.com/vta/expresslanes-api/tree/master/api)

## Usage

The [example.html](http://rawgit.com/vta/expresslanes-api/master/example.html) file demonstrates the usage of this API, and uses the `Interval_Starting` property to calculate the time at which the next request should be made, since data is updated in 5 minute intervals.

`GET` and `PUT` operations are supported to get and set the data. Tools such as [cURL](https://curl.haxx.se/) or [Postman](https://www.getpostman.com/) are recommended for testing. Both requests and responses should be made with Content-Type as `application/json; charset=utf-8`.

### Format
The data sent and received to/from the API is sent as a JSON array of objects with each of the following fields being required in each object:
* Plaza_Name `(string)` is any string describing the location of the area. In the examples, CLW and FSW represent toll locations for "SR 237 West to Sunnyvale" and "I-880 North to Oakland", respectively. This field cannot be null.
* Interval_Starting `(number|null)` a number representing time as the number of milliseconds since 1 January 1970 00:00:00 UTC. This value can be null, but it is highly recommended to be populated, as this value allows clients to determine when the next update should occur.
* Pricing_Module `(string|null)` is the price.
* Message_Module `(string|null`) is any arbitrary message to display.


## GET /
### request
```
curl -X GET -H "Cache-Control: no-cache" "http://localhost:8080"
````

### response
The response should be HTTP 200 (OK), and something like the following in the body:
```
[
    {
        "Plaza_Name": "CLW",
        "Interval_Starting": 1461606307268,
        "Pricing_Module": "0.60",
        "Message_Module": "HOV 2+ NO TOLL"
    },
    {
        "Plaza_Name": "FSW",
        "Interval_Starting": 1461606307268,
        "Pricing_Module": "1.80",
        "Message_Module": "HOV 2+ NO TOLL"
    }
]
```

## PUT /
### request
```
curl -X PUT -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '[
  {
    "Plaza_Name": "CLW",
    "Interval_Starting": 1461606307268,
    "Pricing_Module": "0.55",
    "Message_Module": "HOV 2+ NO TOLL"
  },
  {
    "Plaza_Name": "FSW",
    "Interval_Starting": 1461606307268,
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


### Running in production
First, regenerate the public/private keypair using pusher/keygen.js, then copy the public key into pusher/keys and the private key into a secure folder on the server which will run the docker container, such as `/home/ec2-user/keys`.

Now, pull down the latest image from Docker Hub:

    docker pull scvta/vta-express-lanes-api:latest

Then run the image, passing the key along into the `/usr/src/app/` folder inside the docker container.

    docker run -d -v /home/ec2-user/keys:/usr/src/app/keys -p 80:8080 scvta/vta-express-lanes-api:latest

