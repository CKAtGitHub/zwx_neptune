/**
 * Created by leon on 15/11/9.
 */

angular.module('formlyExample', ['ui.neptune'])
    .controller("formlyExampleController", function ($scope,QueryCtrlCode,RegExpValidatorFactory) {
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
                key: 'customValidator',
                type: 'input',
                templateOptions: {
                    label: '自定义验证器'
                },
                validators: {
                    checkphone: {
                        expression: RegExpValidatorFactory.createRegExpValidator(/^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9])\d{8}$/i),
                        message: '$viewValue + " 无效的电话号码"'
                    }
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