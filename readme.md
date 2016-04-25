# VTA Express Lanes API

An interface for accessing the dynamic toll values for the [VTA Silicon Valley Express Lanes](http://www.vta.org/projects-and-programs/highway/silicon-valley-express-lanes).

The API comes requires three components to work, the "Pusher", the "API", and a client:

##  [The Pusher](/pusher)
Pusher's job is to get the dynamic toll data from the database and send that to an instance of the API running in the cloud.

## [The API](/api)
The API is packaged as a docker image on [Dockerhub](https://hub.docker.com/r/scvta/vta-express-lanes-api/). Its job is to receive the data sent by the Pusher and re-serve it up to the clients.

## The client
The client is demonstrated in [example.html](example.html). It works as the data consumer, getting information from the API and displaying it on a webpage.

![screenshot of example.html in action](screenshot.png?raw=true "screenshot")

