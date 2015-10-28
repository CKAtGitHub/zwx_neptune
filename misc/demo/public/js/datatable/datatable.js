/**
 * Created by leon on 15/10/28.
 */

angular.module("datatableDemo", ["datatable"])
    .controller("DatatableDemoController", function ($scope, $http) {
        $scope.orderConfig = {};
        $http.get("/config/demodtconfig.json").then(function (result) {
            $scope.orderConfig = result.data;
        });
        $scope.orderAction = function (type) {
            console.info(type);
        }
    });