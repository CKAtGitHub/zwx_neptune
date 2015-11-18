/**
 * Created by leon on 15/11/9.
 */

angular.module('formlyExample', ['ui.neptune'])
    .controller("formlyExampleController", function ($scope,QueryCtrlCode) {
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
                key: 'creditCard',
                type: 'input',
                optionsTypes: ['creditCard'],
                templateOptions: {
                    label: '验证信用卡号',
                    placeholder: '378282246310005'
                }
            },
            {
                key: 'ctrlCode',
                type: 'input',
                optionsTypes: ['bizValidator'],
                templateOptions: {
                    label: '异步验证控制编码',
                    placeholder: 'once',
                    reversal: false,
                    searchProp:"no",
                    repository: QueryCtrlCode,
                    repositoryParams: {"defno": "cycle"}
                }
            }
        ];
        vm.originalFields = angular.copy(vm.fields);
    })
    .factory("QueryCtrlCode", function (nptRepository) {
        return nptRepository("QueryMdCtrlcode");
    });