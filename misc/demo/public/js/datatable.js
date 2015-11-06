/**
 * Created by leon on 15/10/28.
 */
angular.module("datatableDemo", ["ui.neptune"])
    .config(function (DatatableStoreProvider) {
        DatatableStoreProvider.store("demodt", {
            header: {
                sn: {
                    label: "订单编号"
                },
                state: {
                    label: "订单状态"
                },
                clientid: {
                    label: "客户编号"
                },
                sales: {
                    label: "销售顾问"
                },
                amount: {
                    label: "订单金额"
                },
                createdate: {
                    label: "创建日期"
                },
                remark: {
                    label: "备注"
                }
            },
            action: {
                view: {
                    label: "查看"
                },
                add: {
                    label: "添加"
                },
                del: {
                    label: "删除"
                },
                edit: {
                    label: "编辑",
                    type: "editForm"
                }
            },
            editForm: {
                validationAndViewRules: {
                    sn: {
                        label: "订单编号:",
                        inputType: 'text',
                        required: true,
                        placeholder: "请输入订单编号"
                    },
                    state: {
                        label: "订单状态",
                        inputType: 'text',
                        pattern: {
                            rule: /[0-9]/,
                            message: '必须包含一个数字'
                        },
                        required: true
                    },
                    clientid: {
                        label: "客户编号",
                        inputType: "text",
                        required: true
                    },
                    sales: {
                        label: "销售顾问",
                        inputType: "text",
                        placeholder: "请选择销售顾问.",
                        required: true
                    },
                    amount: {
                        label: "订单金额",
                        inputType: "number",
                        required: true
                    },
                    createdate: {
                        label: "创建日期",
                        inputType: "text",
                        required: true
                    },
                    remark: {
                        label: "备注",
                        inputType: "text",
                        required: false
                    }
                }
            }
        })
    })
    .controller("DatatableDemoController", function ($scope, $http) {
        $scope.orderAction = function (type, item, index) {
            console.info(type);
            if (type === "add") {
                $scope.data.push({
                    "sn": "XXXXX",
                    "state": "buy",
                    "clientid": "10000002315692",
                    "sales": "10000001498059",
                    "amount": 10938.88,
                    "createdate": 1444727302000,
                    "remark": "由点击" + type + "添加的行"
                })
            }

            if (type === "del") {
                $scope.data.splice(index, 1);
            }
        };

        $scope.data = []

        for (var i = 0; i < 30; i++) {
            $scope.data.push({
                "sn": "DD20150101000" + i,
                "state": "buy",
                "clientid": "10000002315692",
                "sales": "10000001498059",
                "amount": 10938.88,
                "createdate": 1444727302000,
                "remark": "测试数据表格配置"
            });
        }

    });