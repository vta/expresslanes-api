# [VTA Express Lanes API (Pusher)](https://github.com/vta/expresslanes-api/tree/master/pusher)

Pusher's job is to get the dynamic toll data from the database and send that to the API living in the cloud. The data it sends needs to comply with the schema the API expects to receive.

### Running in development
```
$ npm install
$ node pusher.js
```

## Public & Private Key Usage
The data sent to the API by Pusher is encrypted to prevent against malicious data submission to the API by unknown third-parties. The private and public key files are included in the repository as examples only. These should be replaced when used in production.

The API uses the private key and the Pusher uses the public key. These keys can be generated using the keygen.js program:

    $ node keygen.js