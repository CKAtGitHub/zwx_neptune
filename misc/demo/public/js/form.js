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
            ],
            buttons: {
                ok: true,
                reset: true
            },
            actions: [
                {
                    label: "禁用表单",
                    type: "disable"
                }
            ],
            onSubmitListens: [
                function (model, $timeout, $q) {
                    var deferd = $q.defer();

                    $timeout(function () {
                        deferd.resolve();
                    }, 1000);

                    return deferd.promise;
                }
            ]
        });
    })
    .controller("FormDemoController", function ($scope, OrderInfo, $timeout, $q) {
        var vm = this;
        vm.model = {};
        vm.disabled = false;

        vm.reset = function () {
            vm.nptFormApi.reset();
        };

        vm.submit = function () {
            if (!vm.nptFormApi.form.$invalid) {
                console.info(vm.model);
            }
        };

        $timeout(function () {
            vm.model = {
                sn: "DD213234",
                state: "buy",
                clientid: "1111",
                sales: "123213",
                amount: 123123.01,
                createdate: 12312312312321,
                remark: "测试"

            }
        }, 1000);

        vm.options = {
            store: OrderInfo,
            onRegisterApi: function (nptFormApi) {
                vm.nptFormApi = nptFormApi;
                vm.nptFormApi.addOnSubmitListen(function (model) {
                    var deferd = $q.defer();

                    $timeout(function () {
                        deferd.resolve(model);
                    }, 500);
                    return deferd.promise;
                }).addOnSubmitListen(function (model) {
                    return {
                        demo: model
                    }
                }).setOnActionListen(function (model, action) {
                    vm.nptFormApi.disabled(vm.disabled);
                    vm.disabled = !vm.disabled;
                });
            }
        }

    });