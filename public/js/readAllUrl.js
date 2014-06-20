pam.controller("readAllUrlController", function($scope, $routeParams, $http, $location)
{
	$scope.applicationId = $routeParams.applicationId;
	$scope.serviceName = $routeParams.serviceName;
	$scope.operationName = "Read All";

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
	
	$scope.go = function(path) {
		$location.path(path);
	}
	
	$scope.back = function() {
		window.history.back();
	}			
});