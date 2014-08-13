pam.controller("runController", function ($scope, $routeParams, $http, $location, schemaService) {

    $scope.applicationId = $routeParams.applicationId;
    console.log("APP ID: " + $scope.applicationId);
    $scope.userId = $routeParams.userId;
    $scope.formData = [];
    var l2 = [];
    var l1 = {};

    $scope.level1 = [];
    $scope.childName = 'Fish';

    $scope.currentName = "Trip";
    $scope.labels = [];

    $scope.listViewDeletable = false;
    $scope.listViewReorderable = false;
    $scope.listViewInsertable = false;
    $scope.trueValue = false;

    $scope.readListViewConfig = function () {
        $http.get("/api/user/user1/applications/" + $scope.applicationId + "/run/listView/trip")
		.success(function (records) {
		    console.log("here");
		    $scope.records = records;
		    console.log(records);
		    //$scope.fields = records['_schema']['_schema Body'];
		    var fields = records[0]['_schema']['meta-data']['list-view'];
		    //console.log(fields);

		    console.log(fields['Deletable']);
		    console.log(fields['Reorderable']);
		    console.log(fields['Insertable']);

		    $scope.listViewDeletable = fields['Deletable'];
		    $scope.listViewReorderable = fields['Reorderable'];
		    $scope.listViewInsertable = fields['Insertable'];

		    console.log("Successfully read all applications end point!");
		})
		.error(function (err) {
		    console.log('Unable to read all applications\' end point! Error message: ' + err);
		});
    };

    $scope.readListViewConfig();

    $scope.readFieldsOfTable1 = function () {
        $http.get("/api/user/user1/applications/" + $scope.applicationId + "/run/" + $scope.currentName)
		.success(function (records) {
		    $scope.records = records;
		    console.log(records);
		    //$scope.fields = records['_schema']['_schema Body'];
		    $scope.fields = records[0]['_schema']['meta-data']['edit-view']['fields'];

		    for (var i = 0; i < $scope.fields.length; i++) {
		        var curr = $scope.fields[i];
		        $scope.labels.push({ name: curr['properties']['label'] });
		    }

		    console.log("Successfully read all applications end point!");
		})
		.error(function (err) {
		    console.log('Unable to read all applications\' end point! Error message: ' + err);
		});
    };

    $scope.readFieldsOfTable1();

    $http.get("api/user/" + $scope.userId + "/applications/" + $scope.applicationId + "/run")
    .success(function (formData) {

        $scope.formData = formData;
        l1 = $scope.formData[0];

        for (var obj in l1) {
            l2 = l1[obj];
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

    $scope.getDetailsFromKey = function (step) {
        var result = {};
        for (var i in step) {
            result[i] = step[i];
        }
        return result;
    };

    $scope.back = function () {
        window.history.back();
    }
});