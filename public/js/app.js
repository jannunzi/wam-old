var pam = angular.module("pam", ["ngRoute"]);

pam.controller('AppCtrl', ['$scope', function($scope) {
  $scope.$back = function() { 
    window.history.back();
  };
}]);

pam.config(["$routeProvider", function($routeProvider, $http)
{
	$routeProvider
	.when("/applicationList",
	{
		templateUrl: "templates/applicationList.html",
		controller: "ApplicationListController"
	})
	.otherwise({
		templateUrl: "templates/applicationList.html",
		controller: "ApplicationListController"
	})
	;
}]);
