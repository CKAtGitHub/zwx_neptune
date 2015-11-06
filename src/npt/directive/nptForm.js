/**
 * Created by leon on 15/10/29.
 */

angular.module("ui.neptune.directive.form", [])
    .controller("FormControllect", ["$scope", function ($scope) {

        this.init = function () {

        };

        $scope.doAction = function (item) {
            if (angular.isDefined($scope.onClickAction)) {
                $scope.onClickAction({
                    item: item
                });
            }
        };

        $scope.doSave = function () {
            console.info("保存表单");
        };

        $scope.doReset = function () {
            console.info("重置表单");
        };

    }])
    .directive("nptForm", ["ModelConfig", function (modelConfig) {
        return {
            restrict: "E",
            controller: "FormControllect",
            replace: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/form/form.html";
            },
            scope: {
                model: "=?",
                data: "=",
                onClickAction: "&",
                onSave: "&",
                onReset: "&"
            },
            compile: function (element) {
                //初始化界面html
                return {
                    pre: function (scope, element, attrs, ctrls) {

                        if (attrs.name && !scope.model) {
                            modelConfig.model(attrs.name, function (model) {
                                scope.model = model;
                            });
                        }
                    },
                    post: function (scope, element, attrs, ctrls) {
                        var demo = element;
                    }
                };
            }
        };
    }]);