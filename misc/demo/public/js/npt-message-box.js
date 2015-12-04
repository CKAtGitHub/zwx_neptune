/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("nptMessageBoxApp", ["ui.neptune"])
    .controller("nptMessageBoxDemoController",
    function ($scope, $templateCache, $timeout, OrderInfo, nptMessageBox) {
        var vm = this;

        vm.tip = function () {
            nptMessageBox
                .open({
                    title: "操作成功(点击窗口外，不关闭窗口)",
                    content: "成功删除客户：XXX公司",
                    modal: {
                        backdrop: 'static'
                    }
                });
        };

        vm.confirm = function () {
            nptMessageBox.open({
                title: "确认",
                content: "确定要删除：ID为123的订单吗？",
                showCancel: true,
                action: {
                    success: {
                        label: "确认",
                        listens: [function ($q, $timeout, modalResult) {
                            var deferd = $q.defer();
                            $timeout(function () {
                                console.log("：" + modalResult.type);
                                deferd.resolve();
                            }, 500);
                            return deferd.promise;
                        }]
                    },
                    second: {
                        label: "异常-不关闭窗口",
                        class: "btn-warning",
                        listens: [function ($q, $timeout, modalResult) {
                            var deferd = $q.defer();
                            $timeout(function () {
                                console.log("：" + modalResult.type);
                                deferd.reject();
                            }, 200);
                            return deferd.promise;
                        }]
                    }
                }
            });
        };

        vm.useTemplate = function () {
            nptMessageBox.open({
                title: "这是标题",
                content: "<div class='input-group'><input ng-model='$$ms.url' placeholder='请输入访问的URL'/><p></p>更多信息请访问：<a href='{{$$ms.url}}'>{{$$ms.url}}</a></div>",
                scope: {
                    url: "http://www.baidu.com"
                },
                showCancel: true,
                action: {
                    success: {
                        label: "确认",
                        listens: [function ($q, $timeout, modalResult) {
                            var deferd = $q.defer();
                            $timeout(function () {
                                deferd.resolve();
                                alert("你将地址改为：" + modalResult.scope.url);
                            }, 200);
                            return deferd.promise;
                        }]
                    }
                }
            });
        };

        vm.useTemplateUrl = function () {
            $templateCache.put('templateId.html', '<div npt-form="$$ms.options" model="$$ms.model"></div>');
            var modal = nptMessageBox.open({
                title: "编辑",
                templateUrl: "templateId.html",
                showCancel: true,
                action: {
                    success: {
                        label: "确认",
                        listens: [function ($q, $timeout, modalResult) {
                            var deferd = $q.defer();
                            $timeout(function () {
                                alert(angular.toJson(modalResult.scope.model));
                                deferd.resolve();
                            }, 200);
                            return deferd.promise;
                        }]
                    }
                },
                scope: {
                    model: {},
                    options: {
                        store: OrderInfo
                    }
                }
            });
            $timeout(function () {
                modal.updateScope("model", {
                        sn: "DD213234",
                        state: "buy",
                        clientid: "1111",
                        sales: "123213",
                        amount: 123123.01,
                        createdate: 12312312312321,
                        remark: "测试"
                    });
            }, 1000);
        };

    })
    .factory("OrderInfo", function (nptFormlyStore) {
        return nptFormlyStore("OrderInfo", {
            options: {
                formState: {
                    disabled: false
                }
            },
            fields: [
                {
                    key: 'sn',
                    type: 'input',
                    templateOptions: {
                        required: true,
                        label: '订单编号:',
                        disabled: true,
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
    });
