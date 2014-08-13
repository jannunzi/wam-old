pam.controller("newController", function ($scope, $routeParams, $http, $location, schemaService) {
    console.log("In new cntrl");
    var app = angular.module('pam', ["ngRoute"]);
    $scope.applicationId = $routeParams.applicationId;
    $scope.collection = $routeParams.collection;
    $scope.userId = $routeParams.userId;
    //$scope.state = $routeParams.state;
    $scope.childEntity = $routeParams.childEntity;

    //var state = $scope.state.split("/");
    //var parentCollectionIndex = state.length - 2;
    //var parentIdIndex = state.length - 1;
    //var parentCollection = state[parentCollectionIndex];
    //var parentId = state[parentIdIndex];

    //$scope.parentCollection = parentCollection;
    //$scope.parentId = parentId;

    console.log($scope.applicationId);
    console.log($scope.collection);
    console.log($scope.childEntity);
    console.log($scope.userId);

    $scope.formData = {};
    $scope.fields = [];
    $scope.labels = [];

    $scope.submitForm = function (formData) {
        var abc = "api/user/" + $scope.userId + "/applications/" + $scope.applicationId + "/post/new/" + $scope.collection + "/" + $scope.childEntity;
        console.log("ABC is: " + abc);
        $http.post(abc, formData)
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

    $scope.back = function () {
        window.history.back();
    }
});