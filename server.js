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

app.get("/api/user/:userId/application", function(req, res) {
	var applications = [
		{_id: 1, name: "Fish 360"},
		{_id: 2, name: "Application 2"},
		{_id: 3, name: "Application 3"},
		{_id: 4, name: "Application 4"},
		{_id: 5, name: "Application 5"},
		{_id: 6, name: "Application 6"},
		{_id: 7, name: "Application 7"},
		{_id: 8, name: "Application 8"},
		{_id: 9, name: "Application 9"},
		{_id: 10, name: "Application 10"},
		{_id: 11, name: "Application 11"},
		{_id: 12, name: "Application 12"},
		{_id: 13, name: "Application 13"},
		{_id: 14, name: "Application 14"},
		{_id: 15, name: "Application 15"},
		{_id: 16, name: "Application 16"},
		{_id: 17, name: "Application 17"},
		{_id: 18, name: "Application 18"},
		{_id: 19, name: "Application 19"},
		{_id: 20, name: "Application 20"},
		{_id: 21, name: "Application 21"},
		{_id: 22, name: "Application 22"},
		{_id: 23, name: "Application 23"},
		{_id: 24, name: "Application 24"},
		{_id: 25, name: "Application 25"},
		{_id: 26, name: "Application 26"},
		{_id: 27, name: "Application 27"},
		{_id: 28, name: "Application 28"},
	];
	res.json(applications);
});

app.listen(port, ipaddress);
