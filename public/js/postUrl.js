pam.controller("postUrlController", function($scope, $routeParams, $http, $location, schemaService)
{
	var app = angular.module('pam', ["ngRoute"]);
	$scope.applicationId = $routeParams.applicationId;
	$scope.serviceName = $routeParams.serviceName;
	$scope.operationName = "Create";
	$scope.formData = {};

	$scope.submitForm = function(formData) {

 		$http.post("api/user/user1/applications/"+$scope.applicationId+"/services/"+$scope.serviceName+"/postUrl", formData)
		.success(function(msg) {		
			$scope.formData = {};
			$scope.result = 'Successfully created new end point!';
			console.log('Successfully created new end point!');
		})
		.error(function(errorMsg) {
			$scope.result = 'Unable to create new end point! Error message: '+ errorMsg;
			console.log('Unable to create new end point! Error message: '+ errorMsg);
		}); 
	}
	
	$scope.fieldList = schemaService.getAllFields($scope.serviceName);
	
	$scope.go = function(path) {
		$location.path(path);
	}
	
	$scope.back = function() {
		window.history.back();
	}	
});