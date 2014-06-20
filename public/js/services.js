pam.controller("ServiceListController", function($scope, $routeParams, $http, $location, schemaService)
{
	$scope.applicationId = $routeParams.applicationId;
	$http.get("/api/user/user1/applications/"+$scope.applicationId)
	.success(function(application){
		$scope.application = application;
	});
	$scope.serviceList = schemaService.getAllServiceNames();
	
	$scope.back = function() {
		window.history.back();
	}	
});

pam.controller("ServiceController", function($scope, $routeParams, $http, $location)
{
	$scope.applicationId = $routeParams.applicationId;
	$scope.serviceName = $routeParams.serviceName;
	$scope.go = function(path) {
		$location.path(path);
	}
	
	$scope.back = function() {
		window.history.back();
	}		
});

