# VTA Express Lanes API

This API was written as a [Dockerized Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/).

to build the docker image:

    $ docker build -t vta/expresslanes_api .

to run the built image:

    $ docker run -p 49160:8080 -d vta/expresslanes_api


to test if it is working:

    $ curl -i localhost:49160



to push express lanes data to the API:
    (cURL):
    curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '{ 
        "237S" : { "toll" : null, "message" : "HOV 2+ Only"},
        "880N" : { "toll" : "0.50", "message" : "HOV 2+ Only"}
    }' "http://localhost:49160"

    (HTTP):
    POST  HTTP/1.1
    Host: localhost:49160
    Content-Type: application/json
    Cache-Control: no-cache
    
    { 
        "237S" : { "toll" : null, "message" : "HOV 2+ Only"},
        "880N" : { "toll" : "0.50", "message" : "HOV 2+ Only"}
    }