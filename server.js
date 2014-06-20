var express	= require('express');
var app		= express();
var port	= process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ipaddress	= process.env.OPENSHIFT_NODEJS_IP;
var mongojs   = require('mongojs');

var connection_string = '127.0.0.1:27017/pam';

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
	connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
	process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
	process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
	process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
	process.env.OPENSHIFT_APP_NAME;
};

var express = require('express');  
var app = express();

function startMainApplication(){
	app.configure(function() {
		app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
		app.use(express.logger('dev')); 						// log every request to the console
		app.use(express.bodyParser()); 							// pull information from html in POST
		app.use(express.methodOverride()); 						// simulate DELETE and PUT
		app.use(app.router);
	});
}

function createServiceEndpoints() {
	
	var db = mongojs(connection_string, ['applications', 'user', 'fish','trip']);

	var applicationsUrl = "/api/user/:userId/applications";
	console.log(applicationsUrl);
	app.get(applicationsUrl, function(req, res) { 
	console.log("/api/user/:userId/applications");
		db['applications'].find(function(err, applications){
			console.log(applications);
			res.json(applications);
		});
	});	

	
	var createApplicationUrl = "/api/user/:userId/applications/createApplication";
	console.log(createApplicationUrl);
	app.post(createApplicationUrl, function(req, res){
		var collectionName = 'applications';
		var data = req.body;
        db[collectionName].save(data, function(err, result) {
			if(err){
				console.log('Unable to insert new application into mongo! Error message: '+err);
				res.send(err);
			}
			else{
				console.log('Successfully inserted new application into mongo');
				res.send('Successfully inserted new application into mongo');
			}
		});
	});
	
	var applicationUrl = "/api/user/:userId/applications/:applicationId";
	console.log(applicationUrl);
	app.get(applicationUrl, function(req, res) {
	console.log("/api/user/:userId/applications/:applicationId");
		console.log(req.params);
		db['applications'].findOne({
			_id:mongojs.ObjectId(req.params.applicationId)
		}, function(err, application) {
			res.json(application);
		});
	});	
	
	var servicesUrl = "/api/user/:userId/applications/:applicationId/services";
	console.log(servicesUrl);
	app.get(servicesUrl, function(req, res) { 
		console.log(schema);
		res.json(schema);
	});		
	
	var readAllUrl = "/api/user/:userId/applications/:applicationId/services/:serviceName/readAllUrl";
	console.log(readAllUrl);
	app.get(readAllUrl, function(req, res){
		var serviceName = req.params.serviceName;
		db[serviceName].find(function(err, records){
			if(err){
				console.log('Unable to read applications from mongo! Error message: '+err);
				res.send(err);						
			}
			else{
				console.log(records);
				res.json(records);
			}
		});	
	});
	
	var readOneUrl = "/api/user/:userId/applications/:applicationId/services/:serviceName/:fromOperation/readOneUrl/:serviceId";
	console.log(readOneUrl);
	app.get(readOneUrl, function(req, res){
		var id = req.params.serviceId;
		var serviceName = req.params.serviceName;
		var serviceId = req.params.serviceId;
		db[serviceName].findOne({_id:mongojs.ObjectId(serviceId)},function(err, record) {
			if(err){
				console.log('Unable to read application from mongo! Error message: '+err);
				res.send(err);				
			} 
			else{
				console.log('Successfully read application from mongo');
				res.json(record);
			}
		});		
	});
	
	
	var postUrl = "/api/user/:userId/applications/:applicationId/services/:serviceName/postUrl";
	console.log(postUrl);
	app.post(postUrl, function(req, res){
		var id = req.params.applicationId;
		var serviceName = req.params.serviceName;
		var data = req.body;
        db[serviceName].save(data, function(err, result) {
			if(err){
				console.log('Unable to insert into mongo! Error message: '+err);
				res.send(err);
			}
			else{
				console.log('Successfully inserted into mongo');
				res.send('Successfully inserted into mongo');
			}
		});
	});
	
	var putOneUrl = "/api/user/:userId/applications/:applicationId/services/:serviceName/putOneUrl/:serviceId";
	console.log(putOneUrl);
	app.put(putOneUrl, function(req, res){
		var id = req.params.serviceId;
		var data = req.body;
		var serviceName = req.params.serviceName;
		db[serviceName].findOne({_id:mongojs.ObjectId(id)}, function (error, application) {
			db[serviceName].update(application, data, function(err, result) {
				if(err){
					console.log('Unable to update in mongo! Error message: '+err);
					res.send(err);
				}
				else{
					console.log('Successfully updated in mongo');
					res.send('Successfully updated in mongo');
				}
			});
		});		
	});

	var searchOneUrl = "/api/user/:userId/applications/:applicationId/services/:serviceName/searchOneUrl";
	console.log(searchOneUrl);
	app.post(searchOneUrl, function(req, res){
		var serviceName = req.params.serviceName;
		var param = req.body;
		db[serviceName].find(param, function (error, records) {
			if(error){
				console.log('Unable to search in mongo! Error message: '+err);
				res.send(err);
			}
			else{
				console.log('Successfully searched in mongo');
				res.send(records);
			}		
		});
	});		
	
	var deleteUrl = "/api/user/:userId/applications/:applicationId/services/:serviceName/deleteUrl/:serviceId";
	console.log(deleteUrl);
	app.delete(deleteUrl, function(req, res){
		var id = req.params.serviceId;
		var serviceName = req.params.serviceName;
		db[serviceName].findOne({_id:mongojs.ObjectId(id)}, function (error, record) {
			db[serviceName].remove(record, function(err, result) {
				if(err){
					console.log('Unable to delete from mongo! Error message: '+err);
					res.send(err);
				}
				else{
					console.log('Successfully deleted from mongo');
					res.send(record);
				}
			});
		});
	});
}
startMainApplication();
createServiceEndpoints();
app.listen(port, ipaddress);

