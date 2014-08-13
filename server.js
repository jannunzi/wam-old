var express = require('express');
var app = express();
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var mongojs = require('mongojs');
var answer = null;
var connection_string = '127.0.0.1:27017/pam';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
	process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
	process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
	process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
	process.env.OPENSHIFT_APP_NAME;
};

var collections = ['applications', 'masterApplicationsSchema', 'appData'];
var dbUrl = 'localhost/pam';
var db = mongojs.connect(dbUrl, collections);

function startMainApplication() {
    app.configure(function () {
        app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
        app.use(express.logger('dev')); 						// log every request to the console
        app.use(express.bodyParser()); 							// pull information from html in POST
        app.use(express.methodOverride()); 						// simulate DELETE and PUT
        app.use(app.router);
    });
}

function createServiceEndpoints() {

    var db = mongojs(connection_string, ['applications', 'user', 'fish', 'trip', 'masterApplicationsSchema', 'appData']);

    var schemaCollectionName = 'masterApplicationsSchema';
    var dataCollectionName = 'appData';

    var applicationsUrl = "/api/user/:userId/applications";
    app.get(applicationsUrl, function (req, res) {
        db['applications'].find(function (err, applications) {
            res.json(applications);
        });
    });

    var createApplicationUrl = "/api/user/:userId/applications/createApplication";
    app.post(createApplicationUrl, function (req, res) {
        var collectionName = 'applications';
        var data = req.body;
        db[collectionName].save(data, function (err, result) {
            if (err) {
                console.log('Unable to insert new application into mongo! Error message: ' + err);
                res.send(err);
            }
            else {
                console.log('Successfully inserted new application into mongo');
                res.send('Successfully inserted new application into mongo');
            }
        });
    });

    var applicationUrl = "/api/user/:userId/applications/:applicationId";
    app.get(applicationUrl, function (req, res) {
        db['applications'].findOne({
            _id: mongojs.ObjectId(req.params.applicationId)
        }, function (err, application) {
            res.json(application);
        });
    });

    var servicesUrl = "/api/user/:userId/applications/:applicationId/services";
    app.get(servicesUrl, function (req, res) {
        res.json(schema);
    });

    var readAllUrl = "/api/user/:userId/applications/:applicationId/services/:serviceName/readAllUrl";
    app.get(readAllUrl, function (req, res) {
        var serviceName = req.params.serviceName;
        db[serviceName].find(function (err, records) {
            if (err) {
                console.log('Unable to read applications from mongo! Error message: ' + err);
                res.send(err);
            }
            else {
                console.log(records);
                res.json(records);
            }
        });
    });

    /* gets all the schemas for an application */
    var readAllSchema = "/api/user/:userId/applications/:applicationId/ui";
    app.get(readAllSchema, function (req, res) {
        db[schemaCollectionName].find({ applicationObjectId: req.params.applicationId }, function (err, applications) {
            res.json(applications);
        });
    });

    /* Gets the entire schema object for a given schema */
    /* Used in getting the list view config and order of fields */
    var readListViewConfig = "/api/user/:userId/applications/:applicationId/userInterfaces/:schemaName/getSchemaProperties";
    app.get(readListViewConfig, function (req, res) {
        db[schemaCollectionName].findOne({ schemaName: req.params.schemaName }, function (err, record) {
            if (err) {
                console.log('Unable to read application from mongo! Error message: ' + err);
                res.send(err);
            }
            else {
                console.log('Successfully read application from mongo');
                res.json(record);
            }
        });
    });

    /* Save the updated list view configuration */
    var updateListViewConfig = "/api/user/:userId/applications/:applicationId/userInterfaces/:schemaName/listView/save";
    app.put(updateListViewConfig, function (req, res) {

        db[schemaCollectionName].update({ schemaName: req.params.schemaName },
            { $set: { '_schema.meta-data.list-view': req.body } }, function (err, result) {
                if (err) {
                    console.log('Unable to update in mongo! Error message: ' + err);
                    res.send(err);
                }
                else {
                    console.log('Successfully updated in mongo');
                    res.send('Successfully updated in mongo');
                }
            });
    });

    /* Saves the config of edit view changes */
    var updateEditViewConfig = "/api/user/:userId/applications/:applicationId/:type/:schemaName/editView/save";
    app.put(updateEditViewConfig, function (req, res) {
        db[schemaCollectionName].update({ schemaName: req.params.schemaName },
        { $set: { '_schema.meta-data.edit-view.config': req.body } }, function (err, result) {
            if (err) {
                console.log('Unable to update in mongo! Error message: ' + err);
                res.send(err);
            }
            else {
                console.log('Successfully updated in mongo');
                res.send('Successfully updated in mongo');
            }
        });
    });

    /* Returns the details of the field chosen on the edit field page */
    var readEditField = "/api/user/:userId/applications/:applicationId/userInterfaces/:schemaName/editView/:fieldName";
    app.get(readEditField, function (req, res) {
        db[schemaCollectionName].findOne({
            schemaName: req.params.schemaName,
            '_schema.meta-data.edit-view.fields.name': req.params.fieldName
        }, function (err, record) {
            if (err) {
                console.log('Unable to read application from mongo! Error message: ' + err);
                res.send(err);
            }
            else {
                console.log('Successfully read application from mongo');
                res.json(record);
            }
        });
    });

    /* Save the updated field changes to the database schema */
    var updateEditFieldConfig = "/api/user/:userId/applications/:applicationId/userInterfaces/:schemaName/editView/:fieldName/save";
    app.put(updateEditFieldConfig, function (req, res) {
        db[schemaCollectionName].update(
            { schemaName: req.params.schemaName, '_schema.meta-data.edit-view.fields.name': req.params.fieldName },
            { $set: { '_schema.meta-data.edit-view.fields.$.properties': req.body } },
            function (err, result) {
                if (err) {
                    console.log('Unable to update in mongo! Error message: ' + err);
                    res.send(err);
                }
                else {
                    console.log('Successfully updated in mongo');
                    res.send('Successfully updated in mongo');
                }
            });
    });

    var saveChosenRoot = "/api/user/:userName/applications/:applicationId/chooseRoot/save";
    app.put(saveChosenRoot, function (req, res) {
        console.log(req.params.applicationId);
        console.log(req.body['root']);
        db['applications'].update(
            { _id: mongojs.ObjectId(req.params.applicationId) },
            { $set: { root: req.body['root'] } },
            function (err, result) {
                if (err) {
                    console.log('Unable to update in mongo! Error message: ' + err);
                    res.send(err);
                }
                else {
                    console.log('Successfully updated in mongo');
                    res.send('Successfully updated in mongo');
                }
            });
    });

    var getRoot = "/api/user/:userId/applications/:applicationId/getRoot";
    app.get(getRoot, function (req, res) {
        db['applications'].findOne({ _id: mongojs.ObjectId(req.params.applicationId) },
            { _id: 0, "root": 1 },
            function (err, record) {
                if (err) {
                    console.log('Unable to read application from mongo! Error message: ' + err);
                    res.send(err);
                }
                else {
                    console.log(record);
                    console.log('Successfully read application from mongo');
                    res.json(record);
                }
            });
    });

    var getChild = "/api/user/:userName/applications/:applicationId/getChild/:currentName";
    app.get(getChild, function (req, res) {

        db[schemaCollectionName].findOne({
            applicationObjectId: (req.params.applicationId),
            schemaName: req.params.currentName
        }, { _id: 0, "_schema.one-to-many": 1 },
            function (err, record) {
                if (err) {
                    console.log('Unable to read application from mongo! Error message: ' + err);
                    res.send(err);
                }
                else {
                    // items have value
                    console.log(record);
                    if (typeof record['_schema']['one-to-many'] != "undefined") {
                        console.log("NOT UNDEF");
                        var idNeeded = record['_schema']['one-to-many'][0];

                        console.log('Successfully read application from mongo');
                        db[schemaCollectionName].findOne({
                            applicationObjectId: (req.params.applicationId),
                            _id: mongojs.ObjectId(idNeeded)
                        }, { _id: 0, "schemaName": 1 },
                function (err, record1) {
                    if (err) {
                        console.log('Unable to read application from mongo! Error message: ' + err);
                        res.send(err);
                    }
                    else {
                        console.log('Successfully read application from mongo');
                        var obj = record1['schemaName'];
                        res.json(obj);
                    }
                });
                    }
                } // success case
            });
    });

    var saveFieldOrder = "/api/user/:userId/applications/:applicationId/:type/:schemaName/fieldOrder/save";
    app.put(saveFieldOrder, function (req, res) {
        var data = req.body;
        var schemaNameParam = req.params.schemaName;

        db['masterApplicationsSchema'].update({ schemaName: schemaNameParam },
{ $set: { '_schema.meta-data.order-of-fields': data } }, function (err, result) {
    if (err) {
        console.log('Unable to update in mongo! Error message: ' + err);
        res.send(err);
    }
    else {

        console.log('Successfully updated in mongo');
        res.send('Successfully updated in mongo');
    }
});

    });

    var readOneUrl = "/api/user/:userId/applications/:applicationId/services/:serviceName/:fromOperation/readOneUrl/:serviceId";
    app.get(readOneUrl, function (req, res) {
        var id = req.params.serviceId;
        var serviceName = req.params.serviceName;
        var serviceId = req.params.serviceId;
        db[serviceName].findOne({ _id: mongojs.ObjectId(serviceId) }, function (err, record) {
            if (err) {
                console.log('Unable to read application from mongo! Error message: ' + err);
                res.send(err);
            }
            else {
                console.log('Successfully read application from mongo');
                res.json(record);
            }
        });
    });

    var readOneCustomUrl = "/api/user/:userName/applications/:applicationId/run/edit/:tableName/:id";
    app.get(readOneCustomUrl, function (req, res) {
        var id = req.params.id;
        var tableName = req.params.tableName;
        var applicationId = req.params.applicationId;
        var userName = req.params.userName;
        console.log(id + tableName + applicationId);

        db['appData'].find(
   { "user.name": userName, "app name": applicationId },
   { _id: 0, trip: { $elemMatch: { _id: id } } }, function (err, records) {
       if (err) {
           console.log('Unable to read applications from mongo! Error message: ' + err);
           res.send(err);
       }
       else {
           res.json(records);
       }
   });

    });

    var postUrl = "/api/user/:userId/applications/:applicationId/services/:serviceName/postUrl";
    app.post(postUrl, function (req, res) {
        var id = req.params.applicationId;
        var serviceName = req.params.serviceName;
        var data = req.body;
        db[serviceName].save(data, function (err, result) {
            if (err) {
                console.log('Unable to insert into mongo! Error message: ' + err);
                res.send(err);
            }
            else {
                console.log('Successfully inserted into mongo');
                res.send('Successfully inserted into mongo');
            }
        });
    });

    var putOneUrl = "/api/user/:userId/applications/:applicationId/services/:serviceName/putOneUrl/:serviceId";
    app.put(putOneUrl, function (req, res) {
        var id = req.params.serviceId;
        var data = req.body;
        var serviceName = req.params.serviceName;
        db[serviceName].findOne({ _id: mongojs.ObjectId(id) }, function (error, application) {
            db[serviceName].update(application, data, function (err, result) {
                if (err) {
                    console.log('Unable to update in mongo! Error message: ' + err);
                    res.send(err);
                }
                else {
                    console.log('Successfully updated in mongo');
                    res.send('Successfully updated in mongo');
                }
            });
        });
    });

    var searchOneUrl = "/api/user/:userId/applications/:applicationId/services/:serviceName/searchOneUrl";
    app.post(searchOneUrl, function (req, res) {
        var serviceName = req.params.serviceName;
        var param = req.body;
        db[serviceName].find(param, function (error, records) {
            if (error) {
                console.log('Unable to search in mongo! Error message: ' + err);
                res.send(err);
            }
            else {
                console.log('Successfully searched in mongo');
                res.send(records);
            }
        });
    });

    var deleteUrl = "/api/user/:userId/applications/:applicationId/services/:serviceName/deleteUrl/:serviceId";
    app.delete(deleteUrl, function (req, res) {
        var id = req.params.serviceId;
        var serviceName = req.params.serviceName;
        db[serviceName].findOne({ _id: mongojs.ObjectId(id) }, function (error, record) {
            db[serviceName].remove(record, function (err, result) {
                if (err) {
                    console.log('Unable to delete from mongo! Error message: ' + err);
                    res.send(err);
                }
                else {
                    console.log('Successfully deleted from mongo');
                    res.send(record);
                }
            });
        });
    });

    //CUSTOM
    var readFieldsOfTable = "/api/user/user1/applications/:applicationId/run/new/:tableName";
    app.get(readFieldsOfTable, function (req, res) {
        var appId = req.param.applicationId;
        var tName = req.params.tableName;
        db['masterApplicationsSchema'].find(
    { schemaName: tName },
    { _id: 0, "_schema.meta-data.edit-view.fields": 1 }, function (err, records) {
        if (err) {
            console.log('Unable to read applications from mongo! Error message: ' + err);
            res.send(err);
        }
        else {
            res.json(records);
        }
    });
    });


    var deleteEntry = "/api/user/:userId/applications/:applicationId/run/delete/:tableName/:id";
    app.post(deleteEntry, function (req, res) {
        console.log('In delete');
        var appId = req.params.applicationId;
        var tableName = req.params.tableName;
        var userId = req.params.userId;
        var id = req.params.id;

        console.log(appId);
        console.log(tableName);
        console.log(userId);
        console.log(id);

        //db['appData'].update({ "app name": appId, 'user.name': userId }, { $pull: { 'user.$.Trip': { '_id': mongojs.ObjectId(id) } } }, function (err, result) {
        //    if (err) {
        //        console.log('Unable to insert into mongo! Error message: ' + err);
        //        res.send(err);
        //    }
        //    else {
        //        console.log("Deleted");
        //        res.send('Successfully inserted into mongo');
        //    }
        //});
        db[dataCollectionName].update({ "appId": appId },
            { $pull: { 'User': { '_id': mongojs.ObjectId(id) } } }, function (err, result) {
                if (err) {
                    console.log('Unable to insert into mongo! Error message: ' + err);
                    res.send(err);
                }
                else {
                    console.log("Deleted");
                    res.send('Successfully inserted into mongo');
                }
            });

        //        db.appData.update(
        //    { "appId": "53e31e375bdd2bdae186133f" },
        //    { $pull: { 'User': { _id: '53e48d8fcfa3e2341586db4a' } } }
        //)

    });

    var readDataForParent = "/api/user/:userName/applications/:applicationId/run/readDataForaParent/:allData/:collection";
    app.get(readDataForParent, function (req, res) {

        console.log("in read data for a parent");

        var appId = req.params.applicationId;
        var userId = req.params.userName;
        var collection = req.params.collection;
        var allData = req.params.allData;
        //var id = req.params.id;
        var allDataSplit = allData.split("~");

        console.log(appId);
        console.log(userId);
        console.log(collection);
        //console.log(allData);
        console.log(allDataSplit);

        var finalGroup = "$";

        // the query object is as below: matching condition
        //{ "appId": "53ad3cbfdea87c3bd8666120", "User._id": "u1" }
        var query = {};
        //query['User._id'] = id;
        query['appId'] = appId;

        var tmp = "";
        for (var i = 0; i < allDataSplit.length; i += 2) {
            if (tmp == "") {
                console.log("blank tmp cond");
                query[allDataSplit[i] + "._id"] = mongojs.ObjectId(allDataSplit[i + 1]);
                var tmp = allDataSplit[i];
                console.log("tmp is: " + tmp);
            } else {
                console.log("NO blank tmp cond");
                query[tmp + "." + allDataSplit[i] + "._id"] = mongojs.ObjectId(allDataSplit[i + 1]);
                var tmp = allDataSplit[i];
                console.log("tmp is: " + tmp);
            }
            finalGroup += allDataSplit[i] + ".";
        }

        finalGroup += collection;

        console.log("query: ");
        console.log(query);
        console.log("FG: ");
        console.log(finalGroup);

        var xyz = [];

        var collectionTable = db.collection('appData');

        var tmpObj = "";
        var objects = {};
        for (var x = 0; x < allDataSplit.length; x += 2) {

            if (tmpObj == "") {
                console.log("blank tmp cond");
                objects[x] = { "$unwind": "$" + allDataSplit[x] };
                xyz.push(objects[x]);
                tmpObj = allDataSplit[x];
                console.log("tmp is: " + tmpObj);
            } else {
                console.log("NO blank tmp cond");
                objects[x] = { "$unwind": "$" + tmpObj + "." + allDataSplit[x] };
                xyz.push(objects[x]);
                tmpObj = allDataSplit[x];
                console.log("tmp is: " + tmpObj);
            }
        }

        var finalObj = {};

        finalObj["$unwind"] = finalGroup;
        //console.log("Final obj is: ");
        //console.log(finalObj);

        //collectionTable.aggregate(
        //    { $unwind: "$User" },
        //    { $unwind: "$User.Trip" },
        //    { $match: query },
        //    { $project: { _id: 0, group: '$User.Trip' } },
        //    function (err, result) {
        //        if (err) {
        //            console.log('Unable to read applications from mongo! Error message: ' + err);
        //            res.send(err);
        //        }
        //            // successful db operation
        //        else {
        //            console.log("In reading trips");
        //            console.log(result);
        //            res.json(result);
        //        }
        //    }
        //);

        //        db.appData.aggregate(
        //{ $unwind: "$User" },
        //{ $unwind: "$User.Trip" },
        //{ $unwind: "$User.Trip.Fish" },
        //{ $match: { "appId": "53e31e375bdd2bdae186133f", "User._id": "u1", "User.Trip._id": "T1" } },
        //{ $project: { _id: 0, group: '$User.Trip.Fish' } }
        //);
        xyz.push(finalObj);
        xyz.push({ $match: query });
        xyz.push({ $project: { _id: 0, group: finalGroup } });

        //xyz = [finalObj, { $match: query }, { $project: { _id: 0, group: finalGroup } }];
        //xyz.push(objects[0]);
        //xyz.push(objects[1]);

        console.log(xyz);

        collectionTable.aggregate(
          xyz,
            function (err, result) {
                if (err) {
                    console.log('Unable to read applications from mongo! Error message: ' + err);
                    res.send(err);
                }
                    // successful db operation
                else {
                    console.log("In reading trips");
                    console.log(result);
                    res.json(result);
                }
            }
        );
    });

    var readData = "/api/user/:userName/applications/:applicationId/run/readData/:collection";
    app.get(readData, function (req, res) {

        console.log("in read data");

        var appId = req.params.applicationId;
        var userId = req.params.userName;
        var collection = req.params.collection;

        console.log(collection);

        var allConditions = {};
        allConditions['appId'] = appId;

        console.log(allConditions);

        var addDatacondition = {};
        var stringCond = collection;
        addDatacondition['_id'] = 0;
        addDatacondition[stringCond] = 1;

        console.log(addDatacondition);

        db[dataCollectionName].find(allConditions, addDatacondition, function (err, result) {
            if (err) {
                console.log('Unable to insert into mongo! Error message: ' + err);
                res.send(err);
            }
            else {
                console.log("READ");
                console.log(result);
                res.send(result);
                //res.send('Successfully inserted into mongo');
            }
        });

    });


    var readFieldsOfTable1 = "/api/user/user1/applications/:applicationId/run/:tableName";
    app.get(readFieldsOfTable1, function (req, res) {
        var appId = req.param.applicationId;
        var tName = req.params.tableName;
        db['masterApplicationsSchema'].find(
    { schemaName: tName },
    { _id: 0, "_schema.meta-data.edit-view.fields": 1 }, function (err, records) {
        if (err) {
            console.log('Unable to read applications from mongo! Error message: ' + err);
            res.send(err);
        }
        else {
            res.json(records);
        }
    });
    });

    var readListViewConfig = "/api/user/user1/applications/:applicationId/run/listView/:tableName";
    app.get(readListViewConfig, function (req, res) {
        var appId = req.params.applicationId;
        var tName = req.params.tableName;
        console.log("app id" + appId);
        console.log("table neam" + tName);
        db['masterApplicationsSchema'].find(
    { schemaName: tName },
    { _id: 0, "_schema.meta-data.list-view": 1 }, function (err, records) {
        if (err) {
            console.log('Unable to read applications from mongo! Error message: ' + err);
            res.send(err);
        }
        else {
            res.json(records);
        }
    });
    });

    /* Create new child object */
    var createNewChildObject = "/api/user/:userId/applications/:applicationId/post/newChild/:state/:collection";

    app.post(createNewChildObject, function (req, res) {
        console.log("CRAETE NEW CHILD: " + createNewChildObject);
        console.log(req);
        console.log("in create child object");
        var id = new mongojs.ObjectId();
        var newData = {};
        newData['_id'] = id;

        var appId = req.params.applicationId;
        var userId = req.params.userId;
        var collection = req.params.collection;
        //var childEntity = req.params.childEntity;
        var state = req.params.state;
        console.log("statae is: " + state);
        console.log("collections " + req.params.collection);
        //console.log("child entity " + req.params.childEntity);
        console.log("app id is: " + appId);
        console.log("app id is: " + userId);

        ////var parentId = req.params.parentId;
        var listOfState = state.split("~");
        //var stateLength = state.length;
        //for (var i = 0; i < stateLength; i++) {
        //    //console.log("s" + i + "is: " + state[i]);
        //    listOfState[i] = state[i];
        //}

        console.log(listOfState);

        var data = req.body;

        for (key in data) {
            newData[key] = data[key];
        }

        console.log(newData);

        var query = {};
        //query['User._id'] = id;
        query['appId'] = appId;
        var finalGroup = "";

        var tmp = "";
        for (var i = 0; i < listOfState.length; i += 2) {
            query[listOfState[i] + "._id"] = mongojs.ObjectId(listOfState[i + 1]);
            finalGroup += listOfState[i] + ".$.";
        }

        finalGroup += collection;

        console.log("query: ");
        console.log(query);

        // in case of no parent
        //if (listOfState[stateLength - 3] == "null") {
        //console.log("No parent");
        //var allConditions = {};
        //allConditions['appId'] = appId;

        //console.log(allConditions);

        var addDatacondition = {};
        addDatacondition[finalGroup] = newData;

        console.log(addDatacondition);

        //db[datacollectionname].update({ "appId": appid, 'User._id': userid }, { $push: { 'User.$.Trip': newdata } }, function (err, result) {
        //    if (err) {
        //        console.log('unable to insert into mongo! error message: ' + err);
        //        res.send(err);
        //    }
        //    else {
        //        res.send('successfully inserted into mongo');
        //    }
        //});


        db[dataCollectionName].update(query, { $push: addDatacondition }, function (err, result) {
            if (err) {
                console.log('unable to insert into mongo! error message: ' + err);
                res.send(err);
            }
            else {
                console.log("Yippppeeeeeeeeee");
                res.send('successfully inserted into mongo');
            }
        });

        //}

    });

    //    var createNewObject = "/api/user/:userId/applications/:applicationId/post/new/:parentCollection/:parentId/:collection/:childEntity";
    var createNewObject = "/api/user/:userId/applications/:applicationId/post/new/:collection/:childEntity";
    app.post(createNewObject, function (req, res) {
        console.log("in create ");
        var id = new mongojs.ObjectId();
        var newData = {};
        newData['_id'] = id;

        var listOfState = {};

        var appId = req.params.applicationId;
        var userId = req.params.userId;
        var collection = req.params.collection;
        var childEntity = req.params.childEntity;
        //var state = req.params.state;
        //console.log("statae is: " + state);
        ////console.log("collection is: " + collection);

        ////var parentId = req.params.parentId;
        //var state = state.split("~");
        //var stateLength = state.length;
        //for (var i = 0; i < stateLength; i++) {
        //    //console.log("s" + i + "is: " + state[i]);
        //    listOfState[i] = state[i];
        //}

        //console.log(listOfState);

        //var collection = listOfState[stateLength - 2];
        //var childEntity = listOfState[stateLength - 1];

        console.log("collections " + collection);
        console.log("child entity " + childEntity);

        var data = req.body;

        for (key in data) {
            newData[key] = data[key];
        }

        console.log(newData);

        // in case of no parent
        //if (listOfState[stateLength - 3] == "null") {
        console.log("No parent");
        var allConditions = {};
        allConditions['appId'] = appId;

        console.log(allConditions);

        var addDatacondition = {};
        var stringCond = collection;
        addDatacondition[stringCond] = [newData];

        console.log(addDatacondition);

        db[dataCollectionName].update(allConditions, { $pushAll: addDatacondition }, function (err, result) {
            if (err) {
                console.log('Unable to insert into mongo! Error message: ' + err);
                res.send(err);
            }
            else {
                console.log("INSERTED");
                res.send('Successfully inserted into mongo');
            }
        });
        //} //no parent case ends
        //else {
        // console.log("Parent");
        //var allConditions = {};
        //allConditions['appId'] = appId;

        //var currentPointer = stateLength - 3;

        //for (var i = stateLength - 3; i >= 0 ; i--) {
        //    console.log(listOfState[i]);
        //    allConditions[listOfState[i]._id] = appId;
        //}

        //console.log(allConditions);

        //db[dataCollectionName].update({ "appId": appId, 'User.userName': userId }, { $push: { 'User.$.Trip': newData } }, function (err, result) {
        //    if (err) {
        //        console.log('Unable to insert into mongo! Error message: ' + err);
        //        res.send(err);
        //    }
        //    else {
        //        res.send('Successfully inserted into mongo');
        //    }
        //});

        //}

    });

}

startMainApplication();
createServiceEndpoints();
app.listen(port, ipaddress);

function masterApplicationsSchema(applicationObjectId, _schema, date, emailId, schemaName) {
    this._schema = _schema;
    this.date = date;
    this.emailId = emailId;
    this.applicationObjectId = applicationObjectId;
    this.schemaName = schemaName;
}

// the post method for saving the schema created by the developer
app.post("/pam/applications/saveSchema", function (request, response) {
    var userEmaildId = 'user1@gmail.com';
    var applicationObjectId = 'id1234';

    schemaDefinition = request.body;
    schemaName1 = schemaDefinition["meta-data"];
    var nameOfSchema = schemaName1["schema-name"];

    masterSchemaObject = new masterApplicationsSchema(applicationObjectId,
    schemaDefinition, Date.now, userEmaildId, nameOfSchema);

    db.masterApplicationsSchema.save(masterSchemaObject, function (err, schemaSaved) {
        if (!schemaSaved)
            console.log(err);
        else {
            console.log('saved schema is :-- ' + schemaSaved);
            response.json(schemaSaved);
        }
    });
});