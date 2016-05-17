'use strict';

const fs = require('fs')
	, NodeRSA = require('node-rsa')


var key = new NodeRSA();
key.generateKeyPair();


function writeKey(filename, content){
	fs.writeFileSync(filename, content, 'utf8');
}


console.log('Writing private key to expresslanesapi.key.pem');
writeKey('expresslanesapi.key.pem', key.exportKey('private'));

console.log('Writing public key to expresslanesapi.key.pub');
writeKey('expresslanesapi.key.pub', key.exportKey('public'));