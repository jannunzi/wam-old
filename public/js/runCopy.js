pam.controller("RunListController", function ($scope, $routeParams, $http, $location, schemaService) {
    console.log("in rlx");
    $scope.applicationId = $routeParams.applicationId;
    $scope.userName = $routeParams.userName;
    //    $scope.state = $routeParams.state;
    $scope.collection = $routeParams.collection;

    console.log($scope.collection);

    $scope.labels = [];
    $scope.labelsOriginal = [];

    $scope.listViewDeletable = false;
    $scope.listViewReorderable = false;
    $scope.listViewInsertable = false;
    $scope.listViewUpdatable = false;

    $scope.readListViewConfig = function () {
        $http.get("/api/user/" + $scope.userName + "/applications/" + $scope.applicationId + "/run/listView/" + $scope.collection)
		.success(function (records) {
		    $scope.records = records;
		    //console.log(records);
		    //$scope.fields = records['_schema']['_schema Body'];
		    var fields = records[0]['_schema']['meta-data']['list-view'];
		    console.log(fields);

		    $scope.listViewDeletable = fields['Deletable'];
		    $scope.listViewReorderable = fields['Reorderable'];
		    $scope.listViewInsertable = fields['Insertable'];
		    $scope.listViewUpdatable = fields['Updatabale'];


		    console.log(fields['Deletable']);
		    console.log(fields['Reorderable']);
		    console.log(fields['Updatabale']);
		    console.log(fields['Insertable']);

		    console.log("Successfully read all applications end point!");
		})
		.error(function (err) {
		    console.log('Unable to read all applications\' end point! Error message: ' + err);
		});
    };

    $scope.readListViewConfig();

    $http.get("/api/user/" + $scope.userName + "/applications/" + $scope.applicationId + "/getChild/" + $scope.collection)
              .success(function (childEntity) {
                  console.log("success");
                  //console.log(childEntity);
                  $scope.childEntity = childEntity;
                  //console.log($scope.childEntity);

                  $scope.childEntity = eval("(" + $scope.childEntity + ")");
                  //console.log($scope.childEntity);
              });

    $scope.readFieldsOfTable1 = function () {
        $http.get("/api/user/" + $scope.userName + "/applications/" + $scope.applicationId + "/run/" + $scope.collection)
		.success(function (records) {
		    $scope.records = records;
		    //console.log(records);
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

    $scope.readData = function () {
        $http.get("/api/user/" + $scope.userName + "/applications/" + $scope.applicationId + "/run/readData/" + $scope.collection)
		.success(function (recordsData) {
		    $scope.records = recordsData;
		    //console.log("recordsData");
		    //console.log($scope.records[0][$scope.collection]);
		    $scope.records = $scope.records[0][$scope.collection];


		    $http.get("/api/user/" + $scope.userName + "/applications/" + $scope.applicationId + "/run/" + $scope.collection)
                .success(function (records123) {
                    $scope.records123 = records123;
                    $scope.fields12 = $scope.records123[0]['_schema']['meta-data']['edit-view']['fields'];
                    for (var i = 0; i < $scope.fields12.length; i++) {
                        $scope.labelsOriginal.push({ name: $scope.fields12[i]['name'] });
                    }
                    //console.log($scope.labelsOriginal);
                })
                .error(function (err) {
                    console.log('Unable to read all applications\' end point! Error message: ' + err);
                });
		})
		.error(function (err) {
		    console.log('Unable to read all applications\' end point! Error message: ' + err);
		});
    };

    $scope.readData();

    $scope.back = function () {
        window.history.back();
    }

    //$scope.go = function (collection, idToBeDeleted, applicationId, userId) {
    //    console.log("In go of button click");
    //    console.log(collection);
    //    console.log(idToBeDeleted);
    //    console.log(applicationId);
    //    console.log(userId);

    //    $http.post("api/user/" + userId + "/applications/" + applicationId + "/run/delete/" + collection + "/" + idToBeDeleted)
    //    .success(function (msg) {
    //        console.log("DELETED");
    //        $scope.result = 'Successfully created new end point!';
    //        //$scope.readData();
    //        //$location.path("/run/pam/user/" + userId + "/applications/" + applicationId + "/" + collection);
    //        //var abc = "/run/pam/user/" + userId + "/applications/" + applicationId + "/" + collection;
    //        //console.log(abc);
    //        window.location.assign("/#/run/pam/user/user1/applications/53e31e375bdd2bdae186133f/User")
    //        ////window.history.back();
    //        //$location.path("/run/pam/user/user1/applications/53e31e375bdd2bdae186133f/User");
    //        //window.location.href = '/#/run/pam/user/user1/applications/53e31e375bdd2bdae186133f/User';
    //    })
    //    .error(function (errorMsg) {
    //        $scope.result = 'Unable to create new end point! Error message: ' + errorMsg;
    //    });
    //}

});
