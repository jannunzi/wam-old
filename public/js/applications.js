pam.controller("ApplicationListController", function ($scope, $routeParams, $http, $location) {
    $http.get("api/user/user1/applications")
	.success(function (applications) {
	    $scope.applications = applications;
	});

    $scope.go = function (path) {
        $location.path(path);
    }

    $scope.back = function () {
        window.history.back();
    }
});

pam.controller("ApplicationController", function ($scope, $routeParams, $http, $location, schemaService) {
    $scope.applicationId = $routeParams.applicationId;
    $scope.userName = $routeParams.userId;

    console.log($scope.userName);
    $http.get("/api/user/" + $scope.userName + "/applications/" + $scope.applicationId)
	.success(function (application) {
	    $scope.application = application;
	    $scope.serviceList = schemaService.getAllSchemaNames();;
	});

    $scope.chooseRoot = function () {
        $location.path("/pam/user/" + $scope.userName + "/applications/" + $scope.applicationId + "/chooseRoot");
    }

    $scope.run = function () {
        $scope.rootEntity = null;
        $http.get("/api/user/" + $scope.userName + "/applications/" + $scope.applicationId + "/getRoot")
            .success(function (rootEntity) {
                $scope.rootEntity = rootEntity;
                $location.path("/run/pam/user/" + $scope.userName + "/applications/" + $scope.applicationId + "/" + $scope.rootEntity['root']);
            });
    }

    $scope.go = function (path) {
        $location.path(path);
    }

    $scope.back = function () {
        window.history.back();
    }
});
