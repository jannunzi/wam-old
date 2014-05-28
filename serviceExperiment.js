var fishSchema = {
	schema: {
		name: String,
		length: Number,
		weight: Number
	},
	meta: {
		name: "fish"
	}
};
var tripSchema = {
	schema: {
		name: String,
		latitude: Number,
		longitude: Number,
		fish: [fishSchema]
	},
	meta: {
		name: "trip"
	}
};
var userSchema = {
	properties: {
		username: String,
		password: String,
		dob: Date,
		trips: [tripSchema]
	},
	meta: {
		name: "user"
	}
};
var currentSchema = userSchema;

var express = require('express');
var app = express();

function createServiceEndpoints(schema) {
	var readAllUrl = "/"+schema.meta.name;
	console.log(readAllUrl);
	app.get(readAllUrl, function(req, res){
		res.send("readAllUrl " + schema.meta.name);
//		db[schema.meta.name].find(function(err, list){
//			res.json(list);
//		});
	});
	
	var readByIdUrl = "/"+schema.meta.name+"/:id";
	console.log(readByIdUrl);
	app.get(readByIdUrl, function(req, res){
		var id = req.params.id;
//		db[schema.meta.name].findById({_id: id}, function(err, document){
//			res.json(document);
//		});
		res.send("readByIdUrl " + id);
	});
	
	var postUrl = "/"+schema.meta.name;
	console.log(postUrl);
	app.post(postUrl, function(req, res){
		var data = req.body;
		res.send("postUrl " + data);
	});
	
	var putUrl = "/"+schema.meta.name+"/:id";
	console.log(putUrl);
	app.put(putUrl, function(req, res){
		var id = req.params.id;
		var data = req.body;
		res.send("putUrl " + id + " " + data);
	});
	
	var deleteUrl = "/"+schema.meta.name+"/:id";
	console.log(deleteUrl);
	app.delete(deleteUrl, function(req, res){
		var id = req.params.id;
		res.send("deleteUrl " + id);
	});
	
//	createServiceEnpoints();
}

createServiceEndpoints(currentSchema);

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(3000);
