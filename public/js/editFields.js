pam.controller("editFieldController", function ($scope, $routeParams, $http, $location, schemaService) {

    var applicationId = $routeParams.applicationId;
    var schemaName = $routeParams.schemaName;
    $scope.fieldName = $routeParams.fieldName;

    var requiredAnswer = {};
    var requiredKeys = {};
    var formData = {};

    $http.get("api/user/user1/applications/" + applicationId + "/userInterfaces/" + schemaName + "/editView/" + $scope.fieldName)
      .success(function (formData) {
          var allFields = formData['_schema']['meta-data']['edit-view']['fields'];
          for (var i = 0; i < allFields.length; i++) {
              // get details for the field being edited
              if (allFields[i].name == $scope.fieldName) {
                  $scope.requiredKeys = Object.keys(allFields[i]['properties']);
                  $scope.requiredAnswer = allFields[i]['properties'];
                  break;
              }
          }
      });

    $scope.save = function () {
        $http.put("api/user/user1/applications/" + applicationId + "/userInterfaces/" + schemaName + "/editView/" + $scope.fieldName + "/save",
            $scope.requiredAnswer)
       .success(function (msg) {
           $scope.result = 'Successfully updated end point!';
           console.log('Successfully updated end point!');
       })
       .error(function (errorMsg) {
           $scope.result = 'Unable to update end point! Error message: ' + errorMsg;
           console.log('Unable to update end point! Error message: ' + errorMsg);
       });

    }; // save function ends

    $scope.back = function () {
        window.history.back();
    } // back ends

});