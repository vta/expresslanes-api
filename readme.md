# VTA Express Lanes Data Mover tools

This repo contains some tools for accessing the dynamic toll values for the [VTA Silicon Valley Express Lanes](http://www.vta.org/projects-and-programs/highway/silicon-valley-express-lanes).

Making our API work requires two components, the "Pusher" and the "Receiver".

##  [The Pusher](/pusher)
Pusher's job is to get the dynamic toll data from the database and send that to an instance of the Receiver running in the cloud.

The data sent to the Receiver by Pusher is encrypted to prevent against malicious data submission to the Receiver by unknown third-parties. The public and private keys used for encyption can be generated using the [keygen.js](pusher/keygen.js) program. The private key is used by the receiver, and the public key is used by the Pusher.

## [The Receiver](/receiver)
The Receiver is an api meant to receive the data sent by the Pusher, validate it, and update the data served by the MTLFS flask server.

Detailed information on how to use the Receiver is available in [the readme](receiver/readme.md).