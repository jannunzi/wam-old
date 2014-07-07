var schemaApp = angular.module('schemaApp', []);
var schemaObject = {};
var isUpdate = false;


function initializeToDefault($scope) {
    $scope.fields = [];
    $scope.mappedSchema = [];
    $scope.schemaOpened = null;
    schemaObject = {};
    isUpdate = false;
}

schemaApp.controller('SchemaController', ['$scope', '$http' , function ($scope, $http) {
    $scope.fields = [];
    $scope.mappedSchema = [];

    $scope.$watch('$viewContentLoaded', function () {
        getAllSchemas($scope, $http);
    });

    $scope.addField = function () {

        var jsObject = createObjectCombo($scope.schema.fieldName, $scope.schema.fieldType);
        $scope.fields.push(jsObject);
        $scope.schema.fieldName = '';
        $scope.schema.fieldType = '';        
    };

    $scope.removeField = function (fieldToRemove) {
        $scope.fields = removeValue($scope.fields, fieldToRemove);
    };

    $scope.submitSchema = function () {
        
        if (isUpdate) {
            var schemaId = $scope.schemaOpened['_id'];
            schemaObject = convertJSObjectsInSchema($scope.fields, $scope.schemaOpened['schemaName']);
            $scope.schemaOpened['_schema'] = schemaObject;
            delete $scope.schemaOpened['_id'];
            console.log($scope.schemaOpened);
            $http.post("/wam/application/updateSchema/" + schemaId, $scope.schemaOpened )
                .success(function () {
                    getAllSchemas($scope, $http);
                });
            
            initializeToDefault($scope);
        } else {
            schemaObject = convertJSObjectsInSchema($scope.fields, $scope.schema.schemaName);
            $http.post("/wam/application/saveSchema", schemaObject)
                .success(function () {
                    initializeToDefault($scope);
                    getAllSchemas($scope, $http);
                });
        }
    };

    // the following function add the schema as a link to one to many 
    // functionality i.e.this schema becomes the end point of one to many
    $scope.mapToSchema = function (schemaToBeMapped) {
        if (schemaObject.hasOwnProperty('_schema Body')) {
            if (schemaObject.hasOwnProperty('one-to-many')) {
                var oneToManyArray = schemaObject['one-to-many'];

                // the if condition stops the mapped schema to refer to itself i.e. stop from making a loop
                if (isUpdate && (schemaToBeMapped['_id'] == $scope.schemaOpened['_id'])) {
                    showErrorMessage('Error! The schema cannot refer to itself');
                    return;
                }

                // this condition checks to add duplicate entries.
                if (containsSchemaId(schemaToBeMapped._id, oneToManyArray)) {
                    schemaObject['one-to-many'].push(schemaToBeMapped._id);
                    $scope.mappedSchema.push(schemaToBeMapped);
                } else {
                    showErrorMessage('Error! The schema is already available in the list');
                    return;
                }
                
            } else {
                schemaObject = addProperty(schemaObject, 'one-to-many', [schemaToBeMapped._id]);
                $scope.mappedSchema.push(schemaToBeMapped);
            }
        } else {
            showErrorMessage('Error! First create a schema');
        }
    };

    // un-maps the schema from the current schema
    $scope.unmapToSchema = function (schemaToBeUnmapped) {
        $scope.mappedSchema = removeValue($scope.mappedSchema, schemaToBeUnmapped);
        if (isUpdate) {
            var idToRemove = schemaToBeUnmapped['_id'];
            var arrayToRemoveIdFrom = $scope.schemaOpened['_schema']['one-to-many'];
            $scope.schemaOpened['_schema']['one-to-many'] = removeValue(arrayToRemoveIdFrom, idToRemove);
        }
    };

    // drop the document from masterSchema collection and remove collection as well(to be implemented)
    $scope.deleteSchema = function (schemaId) {
        $http.delete("/wam/application/removeSchema/" + schemaId )
            .success(function () {
                getAllSchemas($scope, $http);
            }
        );        
    };

    // open the already existing schema fetched from the server
    $scope.openSchema = function (schemaOpened) {
        isUpdate = true;
        schemaObject = schemaOpened['_schema'];
        $scope.schemaOpened = schemaOpened;
        $scope.fields = revertTheSchema(schemaOpened);
        $scope.mappedSchema = getMappedSchemaList(schemaOpened['_schema'], $scope.allSchemas);        
    };

}]);



// gets all the schemas and assign it to the $scope.allSchemas
function getAllSchemas($scope, $http) {
    $http.get("/wam/application/getAllSchema")
		.success(function (allSchemas) {
		    $scope.allSchemas = allSchemas;
		});
}

function convertJSObjectsInSchema(jsObjectArray, schemaName) {
    var schemaData = {};

    for (index in jsObjectArray) {
        var propertyName = jsObjectArray[index].fieldName;
        var propertyType = jsObjectArray[index].fieldType;
        schemaData = addProperty(schemaData, propertyName, propertyType);

    }
    // adding the schema data to schema object
    schemaObject = addProperty(schemaObject, '_schema Body', schemaData);
    // adding the meta property
    schemaObject = addProperty(schemaObject, 'meta-data', schemaName);

    return schemaObject;
}

// get the unique array i.e. remove duplicacy of elements in array
function containsSchemaId(schemIdToCheck, oneToManyArray) {
    var output = 0;
    for (index in oneToManyArray) {
        if (schemIdToCheck == oneToManyArray[index])
            return false;
    }
    return true;
}

// the function adds another property to the existing JSON Object
function addProperty(object, propertyName, propertyValue) {
    Object.defineProperty(object, propertyName, {
        value: propertyValue,
        writable: true,
        enumerable: true,
        configurable: true
    });

    return object;
}

// the function removes an object from an array of objects and returns the new array
function removeValue(arrayOfValues, valueToRemove) {
    indexOfFieldToRemove = arrayOfValues.indexOf(valueToRemove);
    arrayOfValues.splice(indexOfFieldToRemove, 1);
    return arrayOfValues;
}

// revert the _schemaObject from the server to an array of objects
function revertTheSchema(schemaOpened) {
    var fields = [];
    var convertedObject = {};
    var schemaBody = schemaOpened['_schema']['_schema Body'];
    for (variable in schemaBody) {
        var fieldName = variable;
        var fieldType = schemaBody[variable];
        fields.push(createObjectCombo(fieldName, fieldType));
    }
    return fields;
}

// to create the object of the format {fieldName : 'abc' , fieldType : 'Text Field'}
function createObjectCombo(name, type) {
    var jsObject = { fieldName: name, fieldType: type };
    return jsObject;
}

// revert the many-to-One from the schemaselected to be opened
function getMappedSchemaList(_schema, allSchemas) {
    var list = [];
    var mappedSchema = []
    if (_schema.hasOwnProperty('one-to-many')) {
        list = _schema['one-to-many'];
    }
    for (index in list) {
        for (index2 in allSchemas) {
            if (list[index] == allSchemas[index2]['_id']) {
                mappedSchema.push(allSchemas[index2]);
            }
        }
    }
    return mappedSchema;
}

function closeErrorMessage() {
    $("#myAlert").hide();
}

function showErrorMessage(message) {
    $("#myAlert").find("strong").text(message);
    $("#myAlert").show();
}