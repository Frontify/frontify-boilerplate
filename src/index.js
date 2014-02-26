var express = require('express');
var server = express();

// compress content
server.use(express.compress());

// routes
server.use('/assets/', express.static(__dirname + '/../build/assets/'));
server.use('/assets/', express.static(__dirname + '/assets/'));
server.use('/api/', express.static(__dirname + '/api/'));
server.use(express.static(__dirname + '/views/'));

server.listen(3000); //the port you want to use
