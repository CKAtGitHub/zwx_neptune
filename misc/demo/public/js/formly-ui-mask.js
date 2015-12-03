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
        vm.model = {"dateInput":new Date().getTime()};
        vm.fields = [
            {
                key: 'number1',
                type: 'numberInput',
                templateOptions: {
                    label: '数字类型-numberInput',
                    required:true,
                    min:10.8,
                    max:1000
                }
            },
            {
                key: 'dateInput',
                type: 'dateInput',
                templateOptions: {
                    formateType:"short",
                    label: '使用dateInput处理时间戳数据-短格式',
                    description:"formateType(short|long)可以不配，默认long;"
                }
            },
            {
                key: 'dateInput2',
                type: 'dateInput',
                templateOptions: {
                    label: '使用dateInput处理时间戳数据-长格式',
                    required:true
                },
                defaultValue:new Date().getTime()
            },
            {
                key: 'maskedInput',
                type: 'maskedInput',
                templateOptions: {
                    label: '自定义格式化显示数据',
                    mask:'(9999)9999999',
                    description:'使用可以参考https://github.com/angular-ui/ui-mask'
                }
            }
        ];
        vm.originalFields = angular.copy(vm.fields);
    });