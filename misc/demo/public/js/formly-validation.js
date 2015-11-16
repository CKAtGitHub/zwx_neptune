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
                optionsTypes: ['url'],
                templateOptions: {
                    label: '验证URL',
                    placeholder: 'http://m.yun9.com'
                }
            },
            {
                key: 'email',
                type: 'input',
                optionsTypes: ['email'],
                templateOptions: {
                    label: '验证邮箱地址',
                    placeholder: 'admin@yun9.com'
                }
            }
            ,
            {
                key: 'ip',
                type: 'input',
                optionsTypes: ['ip'],
                templateOptions: {
                    label: '验证IP地址',
                    placeholder: '120.24.84.201'
                }
            },
            {
                key: 'decimal',
                type: 'input',
                optionsTypes: ['decimal'],
                templateOptions: {
                    label: '验证浮点数',
                    placeholder: '88.88'
                }
            }
        ];
        vm.originalFields = angular.copy(vm.fields);
    });