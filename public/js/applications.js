
pam.controller("ApplicationListController", function($scope, $routeParams, $http, $location)
{
	$http.get("api/user/1/application")
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

pam.controller("ApplicationController", function($scope, $routeParams, $http, $location)
{
	$scope.go = function(path) {
		$location.path(path);
	}
	
	$scope.back = function() {
		window.history.back();
	}	
});
