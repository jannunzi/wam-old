pam.controller("searchOneUrlController", function($scope, $routeParams, $http, $location, searchDataService)
{
	$scope.applicationId = $routeParams.applicationId;
	$scope.serviceName = $routeParams.serviceName;
	$scope.operationName = "Search";

	$scope.searchOneUrl = function() {    
 		$http.post("api/user/user1/applications/"+$scope.applicationId+"/services/"+$scope.serviceName+"/searchOneUrl", $scope.formData)
		.success(function(records) {		
			$scope.records = records;
			$scope.result = 'Successfully searched end point!';
			console.log('Successfully searched end point!');
		})
		.error(function(errorMsg) {
			$scope.result = 'Unable to search for end point! Error message: '+ errorMsg;
			console.log('Unable to search for end point! Error message: '+ errorMsg);
		}); 			
	};
	
	$scope.formData = searchDataService.getFormData();
	$scope.searchOneUrl();

	$scope.go = function(path) {
		$location.path(path);
	}
	
	$scope.back = function() {
		window.history.back();
	}	
});

