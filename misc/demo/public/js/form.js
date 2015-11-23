/**
 * Created by leon on 15/10/29.
 */

angular.module("formDemo", ["ui.neptune"])
    .factory("OrderInfo", function (nptFormlyStore) {
        return nptFormlyStore("OrderInfo", {
            options: {
                formState: {
                    disabled: true
                }
            },
            fields: [
                {
                    key: 'sn',
                    type: 'input',
                    templateOptions: {
                        required: true,
                        label: '订单编号:',
                        placeholder: "请输入订单编号"
                    }
                },
                {
                    key: 'state',
                    type: 'input',
                    templateOptions: {
                        required: true,
                        label: '订单状态:',
                        placeholder: "请输入订单编号"
                    }
                },
                {
                    key: 'clientid',
                    type: 'input',
                    templateOptions: {
                        required: true,
                        label: '客户编号:',
                        placeholder: "请输入客户编号"
                    }
                },
                {
                    key: 'sales',
                    type: 'input',
                    templateOptions: {
                        required: true,
                        label: '销售顾问:',
                        placeholder: "请输入销售顾问"
                    }
                },
                {
                    key: 'amount',
                    type: 'input',
                    templateOptions: {
                        required: true,
                        label: '订单金额:'
                    }
                },
                {
                    key: 'createdate',
                    type: 'input',
                    templateOptions: {
                        required: true,
                        label: '创建日期:'
                    }
                },
                {
                    key: 'remark',
                    type: 'input',
                    templateOptions: {
                        label: '备注:'
                    }
                }
            ]
        });
    })
    .controller("FormDemoController", function ($scope, OrderInfo) {
        var vm = this;
        vm.model = {};
        vm.disabled = false;
        vm.setDisabled = function () {
            vm.nptFormApi.disabled(vm.disabled);
            vm.disabled = !vm.disabled;
        };
        vm.options = {
            store: OrderInfo,
            buttons: {
                ok: true,
                reset: true
            },
            onRegisterApi: function (nptFormApi) {
                vm.nptFormApi = nptFormApi;
            }
        }

    });