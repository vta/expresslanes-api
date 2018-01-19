# [Receiver](https://github.com/vta/expresslanes-api/tree/master/receiver)

## Usage


<!-- `GET` and `PUT` operations are supported to get and set the data. Tools such as [cURL](https://curl.haxx.se/) or [Postman](https://www.getpostman.com/) are recommended for testing. Both requests and responses should be made with Content-Type as `application/json; charset=utf-8`.
 -->
 
### Format
The data sent to the API is a JSON array of objects with each of the following fields being required in each object:
* Plaza_Name `(string)` is any string describing the location of the area. In the examples, CLW and FSW represent toll locations for "SR 237 West to Sunnyvale" and "I-880 North to Oakland", respectively. This field cannot be null.
* Interval_Starting `(number|null)` a number representing time as the number of milliseconds since 1 January 1970 00:00:00 UTC. This value can be null, but it is highly recommended to be populated, as this value allows clients to determine when the next update should occur.
* Pricing_Module `(string|null)` is the price.
* Message_Module `(string|null`) is any arbitrary message to display.

## PUT /
Data that is submitted to the API is also in JSON format, and the data follows the same schema as that returned by the GET method, and is placed in a new property called `tolls`.  The value of the `tolls` property must be encrypted and base64 encoded with the public key for it to be accepted. To see how this is done, check out the `sendData` function in [pusher.js](../pusher/pusher.js).

A successful submission will be an empty HTTP 200 (OK) response.


General data structure:
```
{
  "tolls": "encrypted string containing an array of JSON objects"
}
```


decrypted example:
```
{
    "tolls": [
        {
            "biCalSeqID": "36039",
            "Plaza_Name": "CLW",
            "Interval_Starting": 1463610000000,
            "Pricing_Module": "0.50",
            "Message_Module": "HOV 2+ NO TOLL",
            "User": "SYSTEM",
            "Algorithm_Mode": "EL Speed"
        },
        {
            "biCalSeqID": "36039",
            "Plaza_Name": "FSE",
            "Interval_Starting": 1463610000000,
            "Pricing_Module": "2.50",
            "Message_Module": "HOV 2+ NO TOLL",
            "User": "SYSTEM",
            "Algorithm_Mode": "EL Speed"
        }
    ]
}
```

After encrypting the value for the `tolls` property, the result should look something like this:

```
{
  "tolls": "MRp1fzvrK0...jMWeHoo="
}
```


If the data is not formed correctly, a HTTP 400 (Bad Request) response will be given and an error object will be returned showing the error. A 400 response will also be given if the data is not encrypted properly.

Validation error example:
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

### Running as a docker container (This is no longer maintained)

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

