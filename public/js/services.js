
pam.controller("ServiceListController", function($scope, $routeParams, $http, $location)
{
	console.log("ServiceListController");
	$scope.applicationId = $routeParams.applicationId;
	$http.get("/api/user/user1/application/"+$scope.applicationId)
	.success(function(application){
		$scope.application = application;
	});
});
