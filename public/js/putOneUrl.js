pam.controller("putOneUrlController", function($scope, $routeParams, $http, $location, schemaService)
{
	$scope.applicationId = $routeParams.applicationId;
	$scope.serviceName = $routeParams.serviceName;
	$scope.serviceId =  $routeParams.serviceId;	
	$scope.operationName = "Update";
	$scope.formData = {};
	
	$http.get("api/user/user1/applications/"+$scope.applicationId+"/services/"+$scope.serviceName+"/put/readOneUrl/"+$scope.serviceId)
	.success(function(formData){
		$scope.formData = formData;	
	});
	
	$scope.submitForm = function() {
		 delete $scope.formData._id;
 		$http.put("api/user/user1/applications/"+$scope.applicationId+"/services/"+$scope.serviceName+"/putOneUrl/"+$scope.serviceId, $scope.formData)
		.success(function(msg) {		
			$scope.formData = {};
			$scope.result = 'Successfully updated end point!';
			console.log('Successfully updated end point!');
		})
		.error(function(errorMsg) {
			$scope.result = 'Unable to update end point! Error message: '+ errorMsg;
			console.log('Unable to update end point! Error message: '+ errorMsg);
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