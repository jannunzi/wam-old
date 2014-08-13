pam.controller("searchUrlController", function($scope, $routeParams, $http, $location, searchDataService, schemaService)
{
	var app = angular.module('pam', ["ngRoute"]);
	$scope.applicationId = $routeParams.applicationId;
	$scope.serviceName = $routeParams.serviceName;
	$scope.operationName = "Search";
	$scope.formData = {};

	$scope.submitForm = function() {
		searchDataService.setFormData($scope.formData);	
		console.log("/pam/user/user1/applications/"+$scope.applicationId+"/services/"+$scope.serviceName+"/searchOneUrl");
		$scope.go("/pam/user/user1/applications/"+$scope.applicationId+"/services/"+$scope.serviceName+"/searchOneUrl");
	}

	$scope.fieldList = schemaService.getAllFields($scope.serviceName);
	
	$scope.go = function(path) {
		$location.path(path);
	}
	
	$scope.back = function() {
		window.history.back();
	}	
});