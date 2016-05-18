# VTA Express Lanes API

An interface for accessing the dynamic toll values for the [VTA Silicon Valley Express Lanes](http://www.vta.org/projects-and-programs/highway/silicon-valley-express-lanes).

The API comes requires three components to work, the "Pusher", the "API", and a client:

##  [The Pusher](/pusher)
Pusher's job is to get the dynamic toll data from the database and send that to an instance of the API running in the cloud.

The data sent to the API by Pusher is encrypted to prevent against malicious data submission to the API by unknown third-parties. The public and private keys used for encyption can be generated using the [keygen.js](pusher/keygen.js) program. The private key is used by the API, and the public key is used by the Pusher.

## [The API](/api)
The API is packaged as a docker image on [Dockerhub](https://hub.docker.com/r/scvta/vta-express-lanes-api/). Its job is to receive the data sent by the Pusher and re-serve it up to the clients.

Detailed information on how to use the API is available in [the readme](api/readme.md).

## The client
The client works as the data consumer, and can be anything that makes use of the data given by the API, which provides both regular JSON and WebSocket endpoints. Each of these are demonstrated in a web page in [AJAX example](ajax_example.html) and [WebSockets example](websockets_example.html).