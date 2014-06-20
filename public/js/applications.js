pam.controller("ApplicationListController", function($scope, $routeParams, $http, $location)
{
	$http.get("api/user/user1/applications")
	.success(function(applications) {
		$scope.applications = applications;
	});

	$scope.go = function(path) {
		$location.path(path);
	}
	
	$scope.back = function() {
		window.history.back();
	}	 
});

pam.controller("ApplicationController", function($scope, $routeParams, $http, $location, schemaService)
{
	$scope.applicationId = $routeParams.applicationId;
	$http.get("/api/user/user1/applications/"+$scope.applicationId)
	.success(function(application){
		$scope.application = application;	
		$scope.serviceList = schemaService.getAllServiceNames();;
	});
	
	$scope.go = function(path) {
		$location.path(path);
	}
	
	$scope.back = function() {
		window.history.back();
	}	
});
