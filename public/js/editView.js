pam.controller("editViewController", function ($scope, $routeParams, $http, $location, schemaService) {
    $scope.applicationId = $routeParams.applicationId;
    $scope.schemaName = $routeParams.schemaName;

    var formData = {};
    $scope.editViewFields = {};
    $scope.fieldList = {};

    $http.get("api/user/user1/applications/" + $scope.applicationId + "/userInterfaces/" + $scope.schemaName + "/getSchemaProperties")
       .success(function (formData) {
           $scope.editViewFields = formData['_schema']['meta-data']['edit-view']['config'];
           $scope.fieldList = formData['_schema']['_schema Body'];
       });


    $scope.save = function () {

        $http.put("api/user/user1/applications/" + $scope.applicationId + "/userInterfaces/" + $scope.schemaName + "/editView/save", $scope.editViewFields)
        .success(function (msg) {
            $scope.result = 'Successfully updated end point!';
            console.log('Successfully updated end point!');
        })
        .error(function (errorMsg) {
            $scope.result = 'Unable to update end point! Error message: ' + errorMsg;
            console.log('Unable to update end point! Error message: ' + errorMsg);
        });
    } // save ends

    $scope.back = function () {
        window.history.back();
    } // back ends

});