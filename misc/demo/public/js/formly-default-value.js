/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
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
                key: 'defaultValue1',
                type: 'input',
                templateOptions: {
                    label: '使用defaultValue属性设置默认值',
                    required:true
                },
                defaultValue:'hello world'
            },
            {
                key: 'defaultValue2',
                type: 'input',
                templateOptions: {
                    label: '使用异步获取数据，然后设置model的值',
                    description:'通过其他方式获取值，然后在model中为这个属性设置值:'
                },
                defaultValue:function() {
                    QueryCtrlCode.post({defno:"cycle"}).then(function(response) {
                        var data = response.data;
                        if (data && data.length > 0) {
                            vm.model.defaultValue2 = data[0].id;
                        }
                    },function(error) {

                    });
                }()
            }
        ];
        vm.originalFields = angular.copy(vm.fields);
    })
    .factory("QueryCtrlCode", function (nptRepository) {
        return nptRepository("QueryMdCtrlcode");
    });