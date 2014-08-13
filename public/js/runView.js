
pam.controller("RunViewController", function ($scope, $routeParams, $http, $location, schemaService) {
    console.log("In Run View Controller");
    $scope.applicationId = $routeParams.applicationId;
    $scope.userName = $routeParams.userName;
    $scope.state = $routeParams.state;
    $scope.collection = $routeParams.collection;
    $scope.parentCollection = $routeParams.collection;

    $scope.labels = [];
    $scope.labelsOriginal = [];

    console.log($scope.state);
    console.log($scope.collection);

    var state = $scope.state.split("~");
    console.log("state os: + ");
    console.log(state);

    $scope.buildState = "";
    $scope.nextState = "";

    for (var i = 0; i < state.length; i++) {
        $scope.buildState += state[i] + "~";
    }

    console.log(state.length);

    $scope.nextState = $scope.buildState;
    $scope.nextState += $scope.collection;
    $scope.buildState = $scope.buildState.substring(0, $scope.buildState.length - 1);

    console.log("BS");
    console.log($scope.buildState);

    console.log("NS");
    console.log($scope.nextState);


    $scope.listViewDeletable = false;
    $scope.listViewReorderable = false;
    $scope.listViewInsertable = false;
    $scope.listViewUpdatabale = false;

    $scope.readListViewConfig = function () {
        $http.get("/api/user/" + $scope.userName + "/applications/" + $scope.applicationId + "/run/listView/" + $scope.collection)
		.success(function (records) {
		    $scope.records = records;
		    console.log(records);
		    var fields = records[0]['_schema']['meta-data']['list-view'];
		    console.log(fields);

		    $scope.listViewDeletable = fields['Deletable'];
		    $scope.listViewReorderable = fields['Reorderable'];
		    $scope.listViewInsertable = fields['Insertable'];
		    $scope.listViewUpdatable = fields['Updatabale'];

		    console.log("Successfully read all applications end point!");
		})
		.error(function (err) {
		    console.log('Unable to read all applications\' end point! Error message: ' + err);
		});
    };

    $scope.readListViewConfig();

    $http.get("/api/user/" + $scope.userName + "/applications/" + $scope.applicationId + "/getChild/" + $scope.collection)
          .success(function (childEntity) {
              //console.log("success");
              console.log(childEntity);
              $scope.childEntity = childEntity;
              console.log($scope.childEntity);

              $scope.childEntity = eval("(" + $scope.childEntity + ")");
              console.log("obj child: " + $scope.childEntity);
          });

    $scope.readFieldsOfTable1 = function () {
        $http.get("/api/user/" + $scope.userName + "/applications/" + $scope.applicationId + "/run/" + $scope.collection)
		.success(function (records) {
		    $scope.records = records;
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

    $scope.test = 3;

    $scope.readDataForaParent = function () {
        var abc = "/api/user/" + $scope.userName + "/applications/" + $scope.applicationId + "/run/readDataForaParent/" + $scope.buildState + "/" + $scope.collection;
        //if (state.length == 2) {
        //    abc = "/api/user/" + $scope.userName + "/applications/" + $scope.applicationId + "/run/readDataForaParent/" + $scope.buildState + "/" + $scope.collection;
        //    console.log(abc);
        //} else {
        //    abc = "/api/user/" + $scope.userName + "/applications/" + $scope.applicationId + "/run/readDataForaParent/" + $scope.nextState + "/" + $scope.collection;
        //    console.log(abc);
        //}
        $http.get(abc)
    	.success(function (recordsData) {
    	    $scope.records = recordsData;
    	    console.log("recordsData");
    	    console.log($scope.records);
    	    //$scope.records = $scope.records[0][$scope.collection];

    	    $http.get("/api/user/" + $scope.userName + "/applications/" + $scope.applicationId + "/run/" + $scope.collection)
    	        .success(function (records123) {
    	            $scope.records123 = records123;
    	            $scope.fields12 = $scope.records123[0]['_schema']['meta-data']['edit-view']['fields'];
    	            for (var i = 0; i < $scope.fields12.length; i++) {
    	                $scope.labelsOriginal.push({ name: $scope.fields12[i]['name'] });
    	            }
    	            console.log("labels original");
    	            console.log($scope.labelsOriginal);
    	        })
    	        .error(function (err) {
    	            console.log('Unable to read all applications\' end point! Error message: ' + err);
    	        });
    	})
    	.error(function (err) {
    	    console.log('Unable to read all applications\' end point! Error message: ' + err);
    	});
    };

    $scope.readDataForaParent();

    $scope.back = function () {
        window.history.back();
    }
});