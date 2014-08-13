pam.controller("listViewController", function ($scope, $routeParams, $http, $location, schemaService) {
    $scope.applicationId = $routeParams.applicationId;
    $scope.schemaName = $routeParams.schemaName;
    var formData = {};
    $scope.listViewFields = {};

    $http.get("api/user/user1/applications/" + $scope.applicationId + "/userInterfaces/" + $scope.schemaName + "/getSchemaProperties")
	.success(function (formData) {
	    $scope.listViewFields = formData['_schema']['meta-data']['list-view'];
	});

    $scope.save = function () {
        $http.put("api/user/user1/applications/" + $scope.applicationId + "/userInterfaces/" + $scope.schemaName + "/listView/save", $scope.listViewFields)
        .success(function (msg) {
            $scope.formData = {};
            $scope.result = 'Successfully updated end point!';
            console.log('Successfully updated end point!');
        })
        .error(function (errorMsg) {
            $scope.result = 'Unable to update end point! Error message: ' + errorMsg;
            console.log('Unable to update end point! Error message: ' + errorMsg);
        });
    }

    $scope.back = function () {
        window.history.back();
    } // back ends

});