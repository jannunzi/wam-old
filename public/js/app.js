var pam = angular.module("pam", ["ngRoute"]);

pam.controller('AppCtrl', ['$scope', function($scope) {
  $scope.$back = function() { 
    window.history.back();
  };
}]);

pam.config(["$routeProvider", function($routeProvider, $http)
{
	$routeProvider
	.when("/wam/user/:userId/application",
	{
		templateUrl: "templates/applicationList.html",
		controller: "ApplicationListController"
	})
	.when("/wam/user/:userId/application/:applicationId",
	{
		templateUrl: "templates/application.html",
		controller: "ApplicationController"
	})
	.when("/uis",
	{
		templateUrl: "templates/userInterfaceList.html"
	})
	.when("/wam/user/:userId/application/:applicationId/services",
	{
		templateUrl: "templates/serviceList.html",
		controller: "ServiceListController"
	})
	.when("/schemas",
	{
		templateUrl: "templates/schemaList.html"
	})
	.otherwise({
		templateUrl: "templates/applicationList.html",
		controller: "ApplicationListController"
	})
	;
}]);
