pam.controller("deleteController", function ($scope, $routeParams, $http, $location, schemaService) {
    console.log("DC called");
    var app = angular.module('pam', ["ngRoute"]);
    $scope.go = function (collection, idToBeDeleted, applicationId, userId) {
        console.log("In go of button click");
        console.log(collection);
        console.log(idToBeDeleted);
        console.log(applicationId);
        console.log(userId);

        $http.post("api/user/" + userId + "/applications/" + applicationId + "/run/delete/" + collection + "/" + idToBeDeleted)
        .success(function (msg) {
            console.log("DELETED");
            $scope.result = 'Successfully created new end point!';
            //$scope.readData();
            //$location.path("/run/pam/user/" + userId + "/applications/" + applicationId + "/" + collection);
            //var abc = "/run/pam/user/" + userId + "/applications/" + applicationId + "/" + collection;
            //console.log(abc);
            //window.location.assign("/#/run/pam/user/user1/applications/53e31e375bdd2bdae186133f/User")
            ////window.history.back();
            $location.path("/run/pam/user/user1/applications/53e31e375bdd2bdae186133f/User");
            //window.location.href = '/#/run/pam/user/user1/applications/53e31e375bdd2bdae186133f/User';
        })
        .error(function (errorMsg) {
            $scope.result = 'Unable to create new end point! Error message: ' + errorMsg;
        });
    }
});