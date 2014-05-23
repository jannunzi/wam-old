
pam.controller("ApplicationListController", function($scope, $routeParams, $http)
{
	$http.get("api/user/1/application")
	.success(function(applications){
		$scope.applications = applications;
	});
});
