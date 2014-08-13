pam.controller("chooseController", function ($scope, $routeParams, $http, $location, schemaService) {
    var app = angular.module('pam', ["ngRoute"]);

    $scope.applicationId = $routeParams.applicationId;
    $scope.userName = $routeParams.userName;

    console.log($scope.applicationId);
    console.log($scope.userName);

    $http.get("/api/user/" + $scope.userName + "/applications/" + $scope.applicationId + "/ui")
		.success(function (entities) {
		    console.log(entities);
		    $scope.entities = entities;
		})

    $scope.save = function (rootEntity) {
        console.log(rootEntity);
        var chooseRoot = {};
        chooseRoot['root'] = rootEntity;
        $http.put("api/user/" + $scope.userName + "/applications/" + $scope.applicationId + "/chooseRoot/save", chooseRoot)
        .success(function (msg) {
            $scope.result = 'Successfully updated end point!';
            console.log('Successfully updated end point!');
        })
        .error(function (errorMsg) {
            $scope.result = 'Unable to update end point! Error message: ' + errorMsg;
            console.log('Unable to update end point! Error message: ' + errorMsg);
        });
    } // save ends


    $scope.back = function () {
        window.history.back();
    }
});