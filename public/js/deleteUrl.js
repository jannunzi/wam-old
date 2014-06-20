pam.controller("deleteUrlController", function($scope, $routeParams, $http, $location)
{
	$scope.applicationId = $routeParams.applicationId;
	$scope.serviceName = $routeParams.serviceName;
	$scope.operationName = "Delete";
	
	$scope.readAllUrl = function() {
		$http.get("/api/user/user1/applications/"+$scope.applicationId+"/services/"+$scope.serviceName+"/readAllUrl")
		.success(function(records){
			$scope.records = records;
			console.log("Successfully read all applications end point!");
		})
		.error(function(err) {
			console.log('Unable to read all applications\' end point! Error message: ' + err);
		});
	};
	$scope.readAllUrl();
	
	$scope.deleteUrl = function (serviceId) {
		$http.delete("/api/user/user1/applications/"+$scope.applicationId+"/services/"+$scope.serviceName+"/deleteUrl/"+serviceId)
		.success(function(record){
			$scope.result = "Successfully deleted end point!";
			$scope.serviceId = "";
			$scope.readAllUrl();
			console.log("Successfully deleted end point - "+serviceId+"!");
		})
		.error(function(err) {
			console.log('Unable to delete end point! Error message: ' + err);
		});
	};
	
	$scope.go = function(path) {
		$location.path(path);
	}
	
	$scope.back = function() {
		window.history.back();
	}	
});