var userSchema = {
    schema: {
        username: String,
        password: String,
        dob: Date,
        _schemaId: {
            schema: {
                name: String,
                latitude: Number,
                longitude: Number,
                _schemaId: {
                    schema: {
                        name: String,
                        length: Number,
                        weight: Number,
                        _schemaId: null
                    },
                    meta: {
                        name: "fish"
                    }
                }
            },
            meta: {
                name: "trip"
            }
        }
    },
    meta: {
        name: "user"
    }
};

var schemaToCheck = userSchema.schema._schemaId;
console.log("meta is " + userSchema.meta.name);
while (schemaToCheck != null) {
    console.log("meta is " + schemaToCheck.meta.name);
    schemaToCheck = schemaToCheck.schema._schemaId;
}
pam.controller('UIListController', function ($scope, $routeParams, $http, $location) {
    $scope.applicationId = $routeParams.applicationId;
    $http.get("/api/user/user1/application/" + $scope.applicationId)
	.success(function (application) {
	    $scope.application = application;

	    $scope.allSchemas = [
	    
	    ]

	    	    
	    
	    var userSchema = {
	        schema: {
	            username: String,
	            password: String,
	            dob: Date,
	            _schemaId: {
	                schema: {
	                    name: String,
	                    latitude: Number,
	                    longitude: Number,
	                    _schemaId: {
	                        schema: {
	                            name: String,
	                            length: Number,
	                            weight: Number,
	                            _schemaId: null
	                        },
	                        meta: {
	                            name: "fish"
	                        }
	                    }
	                },
	                meta: {
	                    name: "trip"
	                }
	            }
	        },
	        meta: {
	            name: "user"
	        }
	    };

	    var schemaToCheck = userSchema.schema._schemaId;
	    
	    $scope.allSchemas.push({ name: userSchema.meta.name });
	    while (schemaToCheck != null) {
	        $scope.allSchemas.push({ name: schemaToCheck.meta.name});
	        schemaToCheck = schemaToCheck.schema._schemaId;
	    }

	});
});

pam.controller('specificUIListController', function ($scope, $routeParams, $http, $location) {
    $scope.applicationId = $routeParams.applicationId;
    $scope.UIName = $routeParams.uName;

    $scope.applicationId = $routeParams.applicationId;
    $http.get("/api/user/user1/application/" + $scope.applicationId)
	.success(function (application) {
	    $scope.application = application;   

	});
});

pam.controller('displayController', function ($scope, $routeParams, $http, $location) {
    $scope.applicationId = $routeParams.applicationId;
    $scope.UIName = $routeParams.uName;
    
    $scope.allFields = [

    ]

    $http.get("/api/user/user1/application/" + $scope.applicationId)
 .success(function (application) {
     $scope.application = application;

 });

    var userSchema = {
        schema: {
            username: String,
            password: String,
            dob: Date,
            _schemaId: {
                schema: {
                    name: String,
                    latitude: Number,
                    longitude: Number,
                    _schemaId: {
                        schema: {
                            name: String,
                            length: Number,
                            weight: Number,
                            _schemaId: null
                        },
                        meta: {
                            name: "fish"
                        }
                    }
                },
                meta: {
                    name: "trip"
                }
            }
        },
        meta: {
            name: "user"
        }
    };

    var schemaToCheck = userSchema;
    var requiredObject = null;
    while (schemaToCheck != null) {
        if (schemaToCheck.meta.name == $scope.UIName) {
            requiredObject = schemaToCheck;
            break;
        }
        else
            schemaToCheck = schemaToCheck.schema._schemaId;
    }
  
    var keys = Object.keys(requiredObject.schema);

    for (var i = 0; keys[i] != "_schemaId"; i++) {
        console.log(keys[i]);
        $scope.allFields.push({ name: keys[i] });
    }

    $scope.back = function () {
        window.history.back();
    };

    $scope.edit = function () {
        $location.path("/");
    };

});

pam.controller('editController', function ($scope, $routeParams, $http, $location) {
    $scope.applicationId = $routeParams.applicationId;
    $scope.UIName = $routeParams.uName;
    $scope.fieldName = $routeParams.fieldName;

    $http.get("/api/user/user1/application/" + $scope.applicationId)
	.success(function (application) {
	    $scope.application = application;

	});
});