var mongoose = require("mongoose");
var express	= require('express');
var server		= express();
var port		= process.env.PORT || 8080;
mongoose.connect("mongodb://localhost/wam");

server.configure(function() {
	server.use(express.static(__dirname + '/public'));
	server.use(express.bodyParser());
});

server.listen(port);
