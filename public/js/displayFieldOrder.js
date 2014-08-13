pam.controller("displayFieldController", function ($scope, $routeParams, $http, $location, schemaService) {
    $scope.applicationId = $routeParams.applicationId;
    $scope.schemaName = $routeParams.schemaName;

    var formData = {};
    $scope.orderOfFields = {};
    $scope.fieldListKeys = {};

    $http.get("api/user/user1/applications/" + $scope.applicationId + "/userInterfaces/" + $scope.schemaName + "/getSchemaProperties")

       .success(function (formData) {
           $scope.orderOfFields = formData['_schema']['meta-data']['order-of-fields'];
           console.log("BS: ");
           console.log($scope.orderOfFields);

           $scope.fieldListKeys = Object.keys(formData['_schema']['_schema Body']);

           if ($routeParams.direction === "up") {
               var idField = parseInt($routeParams.fieldId);
               console.log("id selected: " + idField);

               var idFieldMinusOne = null;
               if (idField === 0) {
                   idFieldMinusOne = $scope.orderOfFields[$scope.orderOfFields.length - 1];
               } else

                   idFieldMinusOne = $scope.orderOfFields[idField - 1];

               console.log("id to be moved: " + idFieldMinusOne);

               var temp = $scope.orderOfFields[idFieldMinusOne];
               $scope.orderOfFields[idFieldMinusOne] = $scope.orderOfFields[idField];
               $scope.orderOfFields[idField] = temp;

               console.log($scope.orderOfFields);
           }
           else if ($routeParams.direction === "down") {
               var idField = parseInt($routeParams.fieldId);
               console.log("id selected: " + idField);
               var idFieldPlusOne = null;

               if (idField === $scope.orderOfFields.length - 1) {
                   idFieldPlusOne = $scope.orderOfFields[0];
               }
               else {
                   idFieldPlusOne = $scope.orderOfFields[idField + 1];
               }

               var temp = $scope.orderOfFields[idFieldPlusOne];
               console.log("id to be moved: " + idFieldPlusOne);

               $scope.orderOfFields[idFieldPlusOne] = $scope.orderOfFields[idField];
               $scope.orderOfFields[idField] = temp;
           }

       });

    $scope.save = function () {

        $http.put("api/user/user1/applications/" + $scope.applicationId + "/" + $scope.type + "/" + $scope.schemaName + "/fieldOrder/save", $scope.orderOfFields)
        .success(function (msg) {
            formData = {};
            $scope.result = 'Successfully updated end point!';
            console.log('Successfully updated end point!');
        })
        .error(function (errorMsg) {
            $scope.result = 'Unable to update end point! Error message: ' + errorMsg;
            console.log('Unable to update end point! Error message: ' + errorMsg);
        });
    } //save ends


    $scope.back = function () {
        window.history.back();
    } // back ends

});