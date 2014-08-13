pam.controller("childController", function ($scope, $routeParams, $http, $location, schemaService) {
    var app = angular.module('pam', ["ngRoute"]);
    $scope.applicationId = $routeParams.applicationId;
    $scope.table1 = $routeParams.table1;
    $scope.table2 = $routeParams.table2;
    var id = $routeParams.t1id;
    $scope.userId = $routeParams.userId;
    $scope.labels = [];
    var fields = {};


    var l2 = [];
    var l1 = {};

    $scope.level1 = [];
    $scope.childName = null;

    $scope.currentName = "Fish";
    $scope.formData = {};

    $scope.readFieldsOfTable1 = function () {
        $http.get("/api/user/user1/applications/" + $scope.applicationId + "/run/" + $scope.table2)
		.success(function (records) {
		    $scope.records = records;
		    fields = records[0]['_schema']['meta-data']['edit-view']['fields'];

		    for (var i = 0; i < fields.length; i++) {
		        var curr = fields[i];
		        $scope.labels.push({ name: curr['properties']['label'] });
		    }

		    console.log("Successfully read all applications end point!");
		})
		.error(function (err) {
		    console.log('Unable to read all applications\' end point! Error message: ' + err);
		});
    };

    $scope.readFieldsOfTable1();

    $http.get("api/user/" + $scope.userId + "/applications/" + $scope.applicationId + "/run/" + $scope.table1 + "/" + id + "/" + $scope.table2)
    .success(function (formData) {

        $scope.formData = formData;
        l1 = $scope.formData;

        console.log(l1);

        for (var obj in l1) {
            l2 = l1[obj];
          //  console.log(l2);
            break;
        }

        var tmpRow = {};

        for (var row in l2) {
            var eachRow = {};
            tmpRow = l2[row];
            for (var key in tmpRow) {
                if (!(tmpRow[key] instanceof Array)) {
                    eachRow[key] = tmpRow[key];
                }
                else {
                    $scope.childName = key;
                    continue;
                }
            }
            $scope.level1.push(eachRow);
        }
    });

    $scope.back = function () {
        window.history.back();
    }
});