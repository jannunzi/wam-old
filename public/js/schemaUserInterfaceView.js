pam.controller("schemaUserInterfaceViewController", function ($scope, $routeParams, $http, $location, schemaService) {
    $scope.applicationId = $routeParams.applicationId;
    $scope.schemaName = $routeParams.schemaName;
    $scope.type = $routeParams.type;

    $scope.back = function () {
        window.history.back();
    }
});