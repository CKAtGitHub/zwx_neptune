/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly.npt-formly-upload",[])
    .config(function(formlyConfigProvider) {
        formlyConfigProvider.setType({
            name: "npt-formly-upload",
            templateUrl: "/template/formly/npt-formly-upload.html",
            extends: 'input',
            defaultOptions: {
                wrapper:["showErrorMessage"],
                controller: function ($scope, $log, $injector) {
                    var options = $scope.options;
                    var to = options.templateOptions;

                },
                templateOptions: {
                    label: "请选择:",
                    placeholder: "请选择.",
                    disabled:true,
                    valueProp: 'id',
                    labelProp: 'name'
                }
            }

        });
    });