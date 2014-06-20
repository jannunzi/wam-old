var pam = angular.module("pam", ["ngRoute"]);

pam.controller('AppCtrl', ['$scope', function($scope) {
  $scope.$back = function() { 
    window.history.back();
  };
}]);

pam.config(["$routeProvider", function($routeProvider, $http)
{
	$routeProvider
	.when("/pam/user/:userId/applications",
	{
		templateUrl: "templates/applicationList.html",
		controller: "ApplicationListController"
	})
	.when("/pam/user/:userId/applications/:applicationId",
	{
		templateUrl: "templates/application.html",
		controller: "ApplicationController"
	})
	.when("/wam/user/:userId/applications/:applicationId/uis",
	{
	    templateUrl: "templates/userInterfaceList.html",
	    controller: "UIListController"
	})
    .when("/wam/user/:userId/applications/:applicationId/uis/:uName",
	{
	    templateUrl: "templates/specificUserInterfaceList.html",
	    controller: "specificUIListController"
	})
     .when("/wam/user/:userId/applications/:applicationId/uis/:uName/list",
	{
	    templateUrl: "templates/showUI.html",
	    controller: "displayController"
	})
    .when("/wam/user/:userId/applications/:applicationId/uis/:uName/edit",
	{
	    templateUrl: "templates/editView.html",
	    controller: "displayController"
	})
    .when("/wam/user/:userId/applications/:applicationId/uis/:uName/edit/:fieldName",
	{
	    templateUrl: "templates/editFields.html",
	    controller: "editController"
	})
	.when("/pam/user/:userId/applications/:applicationId/services",
	{
		templateUrl: "templates/serviceList.html",
		controller: "ServiceListController"
	})
	.when("/pam/user/:userId/applications/:applicationId/schemas",
	{
		templateUrl: "templates/schemaList.html"
	})	
	.when("/pam/user/:userId/applications/:applicationId/services/:serviceName",
	{
		templateUrl: "templates/service.html",
		controller: "ServiceController"
	})
	.when("/pam/user/:userId/applications/:applicationId/services/:serviceName/readAllUrl",
	{
		templateUrl: "templates/readAllUrl.html",
		controller: "readAllUrlController"
	})
	.when("/pam/user/:userId/applications/:applicationId/services/:serviceName/:fromOperation/readOneUrl/:serviceId",
	{
		templateUrl: "templates/readOneUrl.html",
		controller: "readOneUrlController"
	})	
	.when("/pam/user/:userId/applications/:applicationId/services/:serviceName/readByIdUrl",
	{
		templateUrl: "templates/readByIdUrl.html",
		controller: "readByIdUrlController"
	})
	.when("/pam/user/:userId/applications/:applicationId/services/:serviceName/searchUrl",
	{
		templateUrl: "templates/searchUrl.html",
		controller: "searchUrlController"
	})	
	.when("/pam/user/:userId/applications/:applicationId/services/:serviceName/searchOneUrl",
	{
		templateUrl: "templates/searchOneUrl.html",
		controller: "searchOneUrlController"
	})		
	.when("/pam/user/:userId/applications/:applicationId/services/:serviceName/postUrl",
	{
		templateUrl: "templates/postUrl.html",
		controller: "postUrlController"
	})
	.when("/pam/user/:userId/applications/:applicationId/services/:serviceName/putUrl",
	{
		templateUrl: "templates/putUrl.html",
		controller: "putUrlController"
	})
	.when("/pam/user/:userId/applications/:applicationId/services/:serviceName/putOneUrl/:serviceId",
	{
		templateUrl: "templates/putOneUrl.html",
		controller: "putOneUrlController"
	})	
	.when("/pam/user/:userId/applications/:applicationId/services/:serviceName/deleteUrl",
	{
		templateUrl: "templates/deleteUrl.html",
		controller: "deleteUrlController"
	})	
	.when("/pam/user/:userId/applications/:applicationId/services/:serviceName/deleteUrl/:serviceId",
	{
		templateUrl: "templates/deleteUrl.html",
		controller: "deleteUrlController"
	})	
	.otherwise({
		templateUrl: "templates/applicationList.html",
		controller: "ApplicationListController"
	});
}]);

pam.factory('searchDataService', function() {
	var formData = {};
	return {getFormData:function(){
								return formData;
							},
			setFormData:function(data){
								formData = data;
							}
			};
});

pam.factory('schemaService', function() {
	var currentSchema = {
							schema: {
								username: String,
								password: String,
								dob: Date,
								_schemaId: {
									schema: {
										name: String,
										latitude: Number,
										longitude: Number,
										_schemaId: {
											schema: {
												name: String,
												length: Number,
												weight: Number,
												_schemaId: null
											},
											meta: {
												name: "fish"
											}
										}
									},
									meta: {
										name: "trip"
									}
								}
							},
							meta: {
								name: "user"
							}
						};

	return {getCurrentSchema:function(){
								return currentSchema;
							},
			getAllServiceNames:function(){
								var serviceList = new Array();
								serviceList.push(currentSchema.meta.name);
								var childSchema = currentSchema.schema._schemaId;

								while (childSchema != null) {
									serviceList.push(childSchema.meta.name);
									childSchema = childSchema.schema._schemaId;
								}
								return serviceList;
							},
			getAllFields:function(schemaName){
								var fieldList = new Array();
								var childSchema = currentSchema;
								var requiredSchema = null;
								while (childSchema != null) {
									if (childSchema.meta.name == schemaName) {
										requiredSchema = childSchema;
										break;
									}
									else {
										childSchema = childSchema.schema._schemaId;
									}
								}
								
								var keys = Object.keys(requiredSchema.schema);
								for (var i = 0; keys[i] != "_schemaId"; i++) {
									fieldList.push({name: keys[i]});
								}	
								return fieldList;
							},							
			setCurrentSchema:function(newSchema){
								currentSchema = newSchema;
							}
			};
});