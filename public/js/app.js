var pam = angular.module("pam", ["ngRoute"]);

pam.controller('AppCtrl', ['$scope', function ($scope) {
    $scope.$back = function () {
        window.history.back();
    };
}]);

pam.config(["$routeProvider", function ($routeProvider, $http) {
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
    .when("/pam/user/:userId/applications/:applicationId/run",
	{
	    templateUrl: "templates/runView.html",
	    controller: "runController"
	})
         .when("/pam/user/:userId/applications/:applicationId/running/new/:collection/:childEntity",
	{
	    templateUrl: "templates/newView.html",
	    controller: "newController"
	})
    .when("/pam/user/:userId/applications/:applicationId/run/:table1/:t1id/Fish",
	{
	    templateUrl: "templates/viewChild.html",
	    controller: "childController"
	})
    .when("/pam/user/:userId/applications/:applicationId/run/delete/:tableName/:id",
	{
	    templateUrl: "templates/deleteView.html",
	    controller: "deleteController"
	})
        .when("/pam/user/:userId/applications/:applicationId/run/edit/:tableName/:id",
	{
	    templateUrl: "templates/editRecordView.html",
	    controller: "editRecordController"
	})
	.when("/pam/user/:userId/applications/:applicationId/schemas",
	{
	    templateUrl: "templates/schemaList.html"
	})
    /* Services controllers start from here */
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
    /* Service controllers end here */

    /* UI specific cntrollers start here */

    /* Shows list of schemas for an application for user interface */
    .when("/pam/user/:userId/applications/:applicationId/userInterfaces",
	{
	    templateUrl: "templates/ui.html",
	    controller: "UIController"
	})

    /* Shows links to list view and edit view for a schema */
    .when("/pam/user/:userId/applications/:applicationId/userInterfaces/:schemaName",
	{
	    templateUrl: "templates/schemaUserInterfaceView.html",
	    controller: "schemaUserInterfaceViewController"
	})

    /* Shows list view configuration for a schema */
    .when("/pam/user/:userId/application/:applicationId/userInterfaces/:schemaName/listView",
	{
	    templateUrl: "templates/listView.html",
	    controller: "listViewController"
	})

    .when("/pam/user/:userId/application/:applicationId/userInterfaces/:schemaName/fieldOrder",
	{
	    templateUrl: "templates/fieldOrder.html",
	    controller: "displayFieldController"
	})

    .when("/pam/user/:userId/application/:applicationId/userInterfaces/:schemaName/fieldOrder/:direction/:fieldId",
	{
	    templateUrl: "templates/fieldOrder.html",
	    controller: "displayFieldController"
	})
    .when("/pam/user/:userId/application/:applicationId/userInterfaces/:schemaName/editView",
	{
	    templateUrl: "templates/editView.html",
	    controller: "editViewController"
	})
    .when("/pam/user/:userId/application/:applicationId/userInterfaces/:schemaName/editView/:fieldName",
	{
	    templateUrl: "templates/editFields.html",
	    controller: "editFieldController"
	})
    /* Run new changes */
    .when("/pam/user/:userName/applications/:applicationId/chooseRoot",
	{
	    templateUrl: "templates/chooseRoot.html",
	    controller: "chooseController"
	})
    .when("/run/pam/user/:userName/applications/:applicationId/:collection",
	{
	    templateUrl: "templates/run/list.html",
	    controller: "RunListController"
	})

    /* View at child level */
    .when("/view/user/:userName/applications/:applicationId/running/view/:state*/:collection/view",
	{
	    templateUrl: "templates/run/view.html",
	    controller: "RunViewController"
	})

    .when("/pam/user/:userId/applications/:applicationId/running/newChild/:state*/:collection",
	{
	    templateUrl: "templates/run/newChild.html",
	    controller: "RunNewController"
	})
    // /* View at child level */
    //.when("/delete/user/:userName/applications/:applicationId/running/delete/:collection/:id/:childEntity",
	//{
	//    templateUrl: "templates/run/delete.html",
	//    controller: "RunDeleteController"
	//})
    /* UI specific controllers end here */
	.otherwise({
	    templateUrl: "templates/applicationList.html",
	    controller: "ApplicationListController"
	});
}]);

pam.factory('searchDataService', function () {
    var formData = {};
    return {
        getFormData: function () {
            return formData;
        },
        setFormData: function (data) {
            formData = data;
        }
    };
});

pam.factory('schemaService', function () {
    return {
        getCurrentSchema: function () {
            return currentSchema;
        },
        getAllSchemaNames: function () {
            var serviceList = new Array();
            serviceList.push(currentSchema.meta.name);
            var childSchema = currentSchema.schema._schemaId;

            while (childSchema != null) {
                serviceList.push(childSchema.meta.name);
                childSchema = childSchema.schema._schemaId;
            }
            return serviceList;
        },
        getAllSchemaNamesFlat: function () {
            var allSchemas = new Array();
            for (var i = 0; i < flatSchema.length; i++) {
                console.log("flat schema names: " + flatSchema[i].schemaName);
                allSchemas.push(flatSchema[i].schemaName);
            }// for ends            
            return allSchemas;
        },
        getAllFields: function (schemaName) {
            var res = schemaName.toLowerCase();
            var fieldList = new Array();
            var childSchema = currentSchema;
            var requiredSchema = null;
            while (childSchema != null) {
                if (childSchema.meta.name == res) {
                    requiredSchema = childSchema;
                    break;
                }
                else {
                    childSchema = childSchema.schema._schemaId;
                }
            }

            var keys = Object.keys(requiredSchema.schema);
            for (var i = 0; keys[i] != "_schemaId"; i++) {
                fieldList.push({ name: keys[i] });
            }
            return fieldList;
        },
        getCurrentOrder: function (schemaName) {
            var fieldOrder = new Array();
            var childSchema = currentSchema;
            var requiredSchema = null;
            while (childSchema != null) {
                if (childSchema.meta.name == schemaName) {
                    requiredSchema = childSchema;
                    fieldOrder = requiredSchema.meta.orderOfFields;
                    break;
                }
                else {
                    childSchema = childSchema.schema._schemaId;
                }
            }

            return fieldOrder;
        },
        setCurrentSchema: function (newSchema) {
            currentSchema = newSchema;
        }
    };
});

// the function adds anoher propertyto the existing JSON Object
function addProperty(object, propertyName, propertyValue) {
    Object.defineProperty(object, propertyName, {
        value: propertyValue,
        writable: true,
        enumerable: true,
        configurable: true
    });
    return object;
}