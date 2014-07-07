var express	    = require('express');
var server		= express();
var port		= process.env.PORT || 8080;
var collections = ['application', 'masterApplicationsSchema'];
var dbUrl       = 'localhost/wam';
var mongojs     = require('mongojs');
var db          = mongojs.connect(dbUrl, collections);

var applicationSchema;
var application;

// for testing purposes the following two vars are made and are used in the entire server side CRUD functionalities.
var userEmaildId = 'user1@gmail.com';
var applicationObjectId = 'id1234';
// end

function masterApplicationsSchema(applicationObjectId, _schema, date, emailId, schemaName) {
	this._schema = _schema;
	this.date = date;
	this.emailId = emailId;
	this.applicationObjectId = applicationObjectId;
	this.schemaName = schemaName;
}

server.configure(function() {
	server.use(express.static(__dirname + '/public'));
	server.use(express.bodyParser());
});

server.listen(port);

// the post method for saving the schema created by the developer
server.post("/wam/application/saveSchema", function (request, response) {
    

    schemaDefinition = request.body;
    schemaName = schemaDefinition['meta-data'];
    masterSchemaObject = new masterApplicationsSchema(applicationObjectId,
        schemaDefinition, Date.now, userEmaildId, schemaName);

    db.masterApplicationsSchema.save(masterSchemaObject, function (err, schemaSaved) {
        if (!schemaSaved)
            console.log(err);
        else {
            console.log('saved schema is  :-- ' + schemaSaved);
            response.json(schemaSaved);
        }
    });
});

server.post("/wam/application/updateSchema/:id", function (request, response) {
    var schemaId = request.params.id;
    var updatedSchema = request.body;
    db.masterApplicationsSchema.update({ _id: mongojs.ObjectId(schemaId) }, updatedSchema, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            var searchCriteria = { $and: [{ emailId: { $eq: userEmaildId } }, { applicationObjectId: { $eq: applicationObjectId } }] };
            getAllSchemas(searchCriteria, response);
        }
    });
});

// the find method finds all the relevant schemas with the given user emaild and application id
server.get("/wam/application/getAllSchema", function (request, response) {

    var searchCriteria = {$and: [{ emailId: { $eq: userEmaildId } }, { applicationObjectId: { $eq: applicationObjectId } }]};
    getAllSchemas(searchCriteria, response);
});


server.delete("/wam/application/removeSchema/:id", function (request, response) {
    
    var schemaId = request.params.id;
    console.log(schemaId);
    db.masterApplicationsSchema.remove({ _id: mongojs.ObjectId(schemaId) }, function (err, result) {
        if (err) {
            throw err;
        } else {
            console.log(result);
            var searchCriteria = { $and: [{ emailId: { $eq: userEmaildId } }, { applicationObjectId: { $eq: applicationObjectId } }] };
            getAllSchemas(searchCriteria, response);
        }
    });
    
});



// takes the schema from the master schema and replaces the type with 
// actual datatypes. for ex. test field will be replaced with String.

server.post("/wam/application/schemaCreation/", function(request, response){
	schemaDefinition = request.body;
	db.application.save(createRandomDataForNewSchemaCreated(schemaDefinition), function(err, application){
		if (!application) 
			console.log(err);
		else
			response.json(application);
	});
});

//------------------------------------------------------------------------------------------------------------------------------------
// The GENERIC Functions that are used by the server based functions
//------------------------------------------------------------------------------------------------------------------------------------

// fetches the data from the server based on the given search criteria
// the search criteria can be altered later. It is for now based on the developers email and the applicationId
// This function can be used by post , delete and get to fetch all the schemas after making changes to the server
function getAllSchemas(searchCriteria, response) {
    //console.log("reached in get function to get all documents");
    db.masterApplicationsSchema.find(searchCriteria, function (err, schemas) {
        if (!schemas) {
            // we visited all schemas in the collection
            return;
        }
        // schemas is a collection of all documents in the collection        
        response.json(schemas);
    });
}

function createRandomDataForNewSchemaCreated(schemaDefinition){
	for (var prop in schemaDefinition) {
		if( schemaDefinition.hasOwnProperty( prop ) ) {
			//console.log(schemaDefinition[prop]);
			// assign arbitrary data to the schema.
			if (schemaDefinition[prop] === 'text area' || schemaDefinition[prop] === 'text field'){
				schemaDefinition[prop] = 'testData';			
			} else if(schemaDefinition[prop] === 'Date Pick Up'){
			var nowDate = 'Now Date';
				schemaDefinition[prop] = nowDate;
			}
		} 
	}
	console.log(schemaDefinition);
	return schemaDefinition;
}