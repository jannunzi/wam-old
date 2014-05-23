var express	= require('express');
var app = express();
var port		= process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ipaddress	= process.env.OPENSHIFT_NODEJS_IP;

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

app.listen(port, ipaddress);
