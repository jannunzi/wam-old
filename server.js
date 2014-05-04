var mongoose = require("mongoose");
var express	= require('express');
var server		= express();
var port		= process.env.PORT || 8080;
mongoose.connect("mongodb://localhost/wam");

var ApplicationSchema = mongoose.Schema({
	name: String,
	create: {type: Date, default: Date.now},
	price: {type: Number, default: 0.0}
});

var Application = mongoose.model("Application", ApplicationSchema);

server.configure(function() {
	server.use(express.static(__dirname + '/public'));
	server.use(express.bodyParser());
});

server.listen(port);

server.get("/api/hello/:username", function(req, res) {
	var username = req.params.username;
	res.json({message: "Hello " + username});
});

server.get("/api/application", function(req, res) {
	Application.find(function(err, applications){
		res.json(applications);
	});
});

server.post("/api/application", function(req, res) {
	Application.create(req.body, function(err, application){
		Application.find(function(err, applications){
			res.json(applications);
		});
	});
});

server.delete("/api/application/:id", function(req, res) {
	Application.findById(req.params.id, function(err, application) {
		application.remove(function(err, app){
			Application.find(function(err, applications){
				res.json(applications);
			});
		});
	});
});
