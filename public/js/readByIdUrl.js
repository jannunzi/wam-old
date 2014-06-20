pam.controller("readByIdUrlController", function($scope, $routeParams, $http, $location)
{
	$scope.applicationId = $routeParams.applicationId;
	$scope.serviceName = $routeParams.serviceName;
	$scope.operationName = "Read";

	$scope.readByIdUrl = function() {
		$http.get("/api/user/user1/applications/"+$scope.applicationId+"/services/"+$scope.serviceName+"/readAllUrl")
		.success(function(records){
			$scope.records = records;
			console.log("Successfully read all applications end point!");
		})
		.error(function(err) {
			console.log('Unable to read all applications\' end point! Error message: ' + err);
		});
	};
	$scope.readByIdUrl();
	
	$scope.readOneUrl = function(serviceId) {
		var path = "/pam/user/user1/applications/"+$scope.applicationId+"/services/"+$scope.serviceName+"/Read/readOneUrl/"+serviceId;
		$scope.go(path);
	};	
	
	$scope.go = function(path) {
		$location.path(path);
	}
	
	$scope.back = function() {
		window.history.back();
	}	
		
});