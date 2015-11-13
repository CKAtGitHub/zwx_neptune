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
        vm.model = {"dateInput":new Date()};
        vm.fields = [
            {
                key: 'number1',
                type: 'numberInput',
                templateOptions: {
                    label: '数字类型-numberInput',
                    min:10.8,
                    max:1000
                }
            },
            {
                key: 'dateInput',
                type: 'dateInput',
                templateOptions: {
                    label: '使用dateInput 处理时间戳数据'
                }
            },
            {
                key: 'maskInput',
                type: 'maskedInput',
                templateOptions: {
                    label: '使用maskedInput自定义输入格式 (MM/DD/YYYY)',
                    mask: '99/99/9999'
                }
            }
        ];
        vm.originalFields = angular.copy(vm.fields);
    });