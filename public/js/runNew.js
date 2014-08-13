
pam.controller("RunNewController", function ($scope, $routeParams, $http, $location, schemaService) {
    console.log("In Run New Controller");
    $scope.applicationId = $routeParams.applicationId;
    $scope.userId = $routeParams.userId;
    $scope.state = $routeParams.state;
    $scope.collection = $routeParams.collection;
    //$scope.childEntity = $routeParams.childEntity;

    console.log($scope.applicationId);
    console.log($scope.userId);
    console.log($scope.state);
    console.log($scope.collection);
    //console.log($scope.childEntity);

    $scope.formData = {};
    $scope.fields = [];
    $scope.labels = [];

    $scope.readFieldsOfTable1 = function () {
        $http.get("/api/user/" + $scope.userId + "/applications/" + $scope.applicationId + "/run/" + $scope.collection)
		.success(function (records) {
		    $scope.records = records;
		    $scope.fields = records[0]['_schema']['meta-data']['edit-view']['fields'];
		    for (var i = 0; i < $scope.fields.length; i++) {
		        if ($scope.fields[i]['name'] != '_id')
		            $scope.labels.push({ name: $scope.fields[i]['name'] });
		    }
		})
		.error(function (err) {
		    console.log('Unable to read all applications\' end point! Error message: ' + err);
		});
    };

    $scope.readFieldsOfTable1();

    $scope.submitForm = function (formData) {
        var abc = "api/user/" + $scope.userId + "/applications/" + $scope.applicationId + "/post/newChild/" + $scope.state + "/" + $scope.collection;
        console.log("abc is:");
        console.log(abc);

        $http.post("api/user/" + $scope.userId + "/applications/" + $scope.applicationId + "/post/newChild/" + $scope.state + "/" + $scope.collection, formData)
		.success(function (msg) {
		    $scope.formData = {};
		    $scope.result = 'Successfully created new end point!';
		    //$location.path("/run/pam/user/" + $scope.userId + "/applications/" + $scope.applicationId + "/" + collection);
		    window.history.back();
		})
		.error(function (errorMsg) {
		    $scope.result = 'Unable to create new end point! Error message: ' + errorMsg;
		});
    }

    $scope.back = function () {
        window.history.back();
    }
});