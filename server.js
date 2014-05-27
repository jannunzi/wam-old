var express	= require('express');
var app		= express();
var port		= process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ipaddress	= process.env.OPENSHIFT_NODEJS_IP;
var mongojs   = require('mongojs');

var connection_string = '127.0.0.1:27017/wam';

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
	connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
	process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
	process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
	process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
	process.env.OPENSHIFT_APP_NAME;
}

var db = mongojs(connection_string, ['applications']);

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
});

app.get("/api/hello/:username", function(req, res) {
	var username = req.params.username;
	res.json({message: "Hello " + username});
});

app.get("/api/user/:userId/application", function(req, res) {
	db.applications.find(function(err, applications){
		console.log(applications);
		res.json(applications);
	});
});

app.listen(port, ipaddress);
