# [VTA Express Lanes API (Pusher)](https://github.com/vta/expresslanes-api/tree/master/pusher)

Pusher's job is to get the dynamic toll data from the database and send that to the API living in the cloud. The data it sends needs to comply with the schema the API expects to receive.

### Running in development
```
$ npm install
$ node pusher.js
```