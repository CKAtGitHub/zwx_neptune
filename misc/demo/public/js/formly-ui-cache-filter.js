/**
 * Created by leon on 15/11/9.
 */

angular.module('formlyExample', ['ui.neptune'])
    .controller("formlyExampleController", function ($scope) {
        var vm = this;
        vm.onSubmit = function onSubmit() {
            if (vm.form.$valid) {
                vm.options.updateInitialValue();
                alert(JSON.stringify(vm.model), null, 2);
            }
        };
        vm.model = {};
        vm.fields = [
            {
                key: 'url',
                type: 'input',
                templateOptions: {
                    label: '验证URL',
                    placeholder: 'http://m.yun9.com'
                }
            }
        ];
        vm.originalFields = angular.copy(vm.fields);
    });