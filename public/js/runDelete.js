pam.controller("RunDeleteController", function ($scope, $routeParams, $http, $location, schemaService) {
    console.log("In Run Delete Controller");
    $scope.applicationId = $routeParams.applicationId;
    $scope.userName = $routeParams.userName;
    $scope.collection = $routeParams.collection;
    $scope.id= $routeParams.id;
    $scope.childEntity= $routeParams.childEntity;
    
    console.log();
    $scope.back = function () {
        window.history.back();
    }
});