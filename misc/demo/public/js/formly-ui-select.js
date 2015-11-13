/**
 * Created by leon on 15/11/9.
 */

angular.module('formlyExample', ['ui.neptune',
    "ui.neptune.formly.ui-select"])
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
                "key": "select",
                "type": "ui-select",
                templateOptions: {
                    label: '下拉框-下拉数据已知',
                    valueProp: 'id',
                    labelProp: 'name',
                    placeholder: '下拉框-下拉数据已知',
                    options: [
                        {"id":"1","name":"Option 1"},
                        {"id":"2","name":"Option 2"},
                        {"id":"3","name":"Option 3"}
                    ]
                }
            }, {
                "key": "selectAsync1",
                "type": "ui-select",
                templateOptions: {
                    label: '异步数据下拉框-一次获取不再查询',
                    valueProp: 'id',
                    labelProp: 'name',
                    placeholder: '异步数据下拉框-一次获取不再查询',
                    options: [],
                    datasource: "queryOrderList",
                    datasourceParams: {"userid": "10000001498059", "instid": "10000001463017"}
                }
            }, {
                "key": "selectAsync2",
                "type": "ui-select",
                templateOptions: {
                    label: '异步数据下拉框-根据输入条件动态查询',
                    valueProp: 'id',
                    labelProp: 'name',
                    placeholder: '异步数据下拉框-根据输入条件动态查询',
                    options: [],
                    searchProp: 'id',
                    datasource: "queryOrderList",
                    datasourceParams: {"userid": "10000001498059", "instid": "10000001463017"}
                }
            }];
        vm.originalFields = angular.copy(vm.fields);
    });