/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module('bizValidatorDemo', ["ui.neptune",'ui.bootstrap.showErrors'])
    .controller('bizValidatorCtrl', function ($scope) {
        $scope.session = {"userid": "10000001498059", "instid": "10000001463017"};
        this.submit = function () {
            $scope.$broadcast("show-errors-check-validity");
            if ($scope.userForm.$valid) {
                console.log($scope.userForm);
            }
        }
    })
    .config(function (nptBizValidatorProviderProvider) {
        nptBizValidatorProviderProvider.addConfig('ordersnExist', {
            "bizName": "queryOrderList",
            "bizParams": {"userid": "10000001498059", "instid": "session.instid"},
            "validator": "exist",
            "validExpression": {
                "ordersn": "ordersn"
            }
        });

        nptBizValidatorProviderProvider.addConfig('ordersnExist2', {
            "bizName": "queryOrderList",
            "bizParams": {"userid": "10000001498059", "instid": "10000001463017"},
            "validator": function (data, expression) {
                if (data) {
                    if (angular.isObject(expression)) {
                        for (var key in expression) {
                            for (var i = 0; i < data.length; i++) {
                                if (expression[key] == data[i][key]) {
                                    return true;
                                }
                            }
                        }
                    } else {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].ordersn == expression) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }
        });
    });