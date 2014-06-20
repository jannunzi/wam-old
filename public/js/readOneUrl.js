pam.controller("readOneUrlController", function($scope, $routeParams, $http, $location, schemaService)
{	
	$scope.applicationId = $routeParams.applicationId;
	$scope.serviceName = $routeParams.serviceName;
	$scope.operationName = $routeParams.fromOperation;
	$scope.serviceId =  $routeParams.serviceId;
	$scope.fieldList = {};
	
	$scope.readOneUrl = function () {
		$http.get("/api/user/user1/applications/"+$scope.applicationId+"/services/"+$scope.serviceName+"/"+$scope.operationName+"/readOneUrl/"+$scope.serviceId)
		.success(function(record){
			$scope.record = record;
			console.log("Successfully operation - "+$scope.operationName+ " end point!");
		})
		.error(function(err) {
			console.log('Unable to read end point! Error message: ' + err);
		});
	};
	
	$scope.readOneUrl();	
	$scope.fieldList = schemaService.getAllFields($scope.serviceName);

	$scope.go = function(path) {
		$location.path(path);
	}
	
	$scope.back = function() {
		window.history.back();
	}	
});