pam.controller("UIController", function ($scope, $routeParams, $http, $location) {
    $scope.applicationId = $routeParams.applicationId;
    $scope.type = $routeParams.type;

    $scope.readAllSchema = function () {
        $http.get("/api/user/user1/applications/" + $scope.applicationId + "/ui")
		.success(function (records) {
		    $scope.records = records;
		})
		.error(function (err) {
		    console.log('Unable to read all applications\' end point! Error message: ' + err);
		});
    };

    $scope.readAllSchema();

    $scope.back = function () {
        window.history.back();
    }
});