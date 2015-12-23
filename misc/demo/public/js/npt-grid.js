/**
 * Created by leon on 15/11/24.
 */

angular.module("nptGridApp", ["ui.neptune", "angular.filter"])
    .factory("DemoNptGrid", function (nptGridStore, uiGridConstants, OrderForm) {
        return nptGridStore("DemoNptGrid", {
            gridStyle: "height:300px;",
            gridOptions: {
                columnDefs: [
                    {field: 'sn', displayName: "订单编号", width: 150,
                        cellTemplate:"/template/grid/npt-grid-row-cell-biz.html",
                        nptBizFilter:'orderFilter:{"userid":"10000001498059","ordersn":"$value"}|pick:"ordersn=="+$value|pickup:"name"'},
                    {field: 'state', displayName: "订单状态",width: 80},
                    {field: 'clientid', displayName: "客户名称", enableSorting: false},
                    {field: 'sales', displayName: "业务员", cellFilter: "cacheFilter:'user':'name':'id'"},
                    {field: 'amount', displayName: "订单金额", aggregationType: uiGridConstants.aggregationTypes.sum},
                    {field: 'createdate', displayName: "创建日期", cellFilter: "date|json"},
                    {field: 'remark', displayName: "备注"}
                ],
                enableGridMenu: true,
                multiSelect:false,
                autoHeight:true,
                maxVisibleRowCount:20,
                minRowsToShow:3,
                gridMenuCustomItems: [
                    {
                        title: "添加",
                        action: function ($event) {

                        },
                        leaveOpen: false
                    }
                ]
            },
            action: {
                view: {
                    label: "查看",
                    type: "none"
                },
                add: {
                    label: "添加",
                    type: "add",
                    target: OrderForm,
                    listens: [function ($q, $timeout) {
                        var deferd = $q.defer();
                        console.info("添加方法,在Store中配置");

                        $timeout(function () {
                            deferd.resolve();
                            console.info("添加方法,在配置中执行完成");
                        }, 1000);

                        return deferd.promise;
                    }, function (params, $timeout, $q) {
                        var deferd = $q.defer();
                        console.info("开始调用后台添加服务.");

                        $timeout(function () {
                            if (params.index === 0) {
                                deferd.reject("不能在第一行上添加.");
                            } else {
                                console.info("后台调用更成功.controller");
                                deferd.resolve("添加成功");
                            }
                        }, 500);

                        return deferd.promise;
                    }, function (params) {
                        console.info("添加的第二个方法!");
                    }]
                },
                del: {
                    label: "删除",
                    type: "del",
                    listens: [function ($q, $timeout) {
                        var deferd = $q.defer();
                        console.info("正在执行删除方法：1");
                        $timeout(function () {
                            deferd.resolve();
                            console.info("删除方法1完成");
                        }, 1000);

                        return deferd.promise;
                    },function ($q, $timeout) {
                        var deferd = $q.defer();
                        console.info("正在执行删除方法：2");
                        $timeout(function () {
                            deferd.resolve();
                            console.info("删除方法2完成");
                        }, 1000);

                        return deferd.promise;
                    }]
                },
                edit: {
                    label: "编辑",
                    type: "edit",
                    target: OrderForm,
                    listens: [
                        function (params, $timeout, $q) {
                            var deferd = $q.defer();
                            console.info("开始执行后台更新服务.")
                            $timeout(function () {
                                if (params.index === 0) {
                                    deferd.reject("不能编辑第一行");
                                } else {
                                    deferd.resolve("执行成功!");
                                    params.data["demo"] = "测试添加一行数据";
                                    params.data["sn"] = "测试修改订单号"
                                }
                            }, 500);
                            return deferd.promise;
                        },
                        function () {
                            return "我是第二个方法";
                        }
                    ]
                }
            },
            mobile:{
                templateUrl:"/template/grid/npt-grid-mobile-defaultContent.html",
                fields:{
                    title:"sn",
                    tip:"state",
                    content:"'张三买了：'+remark+'<br/>啦啦啦啦'",
                    createDate:"createdate|timestampFilter"
                }
            }
        })
    })
    .controller("nptGridDemoController", function (DemoNptGrid, $scope, $timeout) {
        var vm = this;

        vm.nptGridOptions = {
            store: DemoNptGrid,
            onRegisterApi: function (nptGridApi) {
                vm.nptGridApi = nptGridApi;
            }
        };

        vm.model = [];

        $timeout(function () {
            var tempDatas = [];
            for (var i = 0; i < 30; i++) {
                tempDatas.push({
                    "sn": "1000000232206" + i,
                    "state": "buy",
                    "clientid": "10000002315692",
                    "sales": "10000001498059",
                    "amount": 10938.88 + i,
                    "createdate": (new Date().getTime() + 1000 * i),
                    "remark": "测试数据表格配置"+i
                });
            }

            vm.model = tempDatas;
        }, 500);


    }).factory("OrderForm", function (nptFormlyStore, QueryCtrlCode) {
        return nptFormlyStore("OrderForm", {
            options: {},
            fields: [
                {
                    key: 'sn',
                    type: 'input',
                    templateOptions: {
                        label: '订单编号:',
                        disabled: true,
                        required: true
                    }
                },
                {
                    key: 'clientid',
                    type: 'input',
                    templateOptions: {
                        label: '客户ID:',
                        required: true
                    }
                },
                {
                    key: 'state',
                    type: 'ui-select',
                    templateOptions: {
                        required: true,
                        optionsAttr: "bs-options",
                        label: '订单状态:',
                        valueProp: 'no',
                        labelProp: 'name',
                        repository: QueryCtrlCode,
                        repositoryParams: {"defno": "orderstatetype"},
                        options: [],
                        allowClear: false
                    }
                },
                {
                    key: 'sales',
                    type: 'input',
                    templateOptions: {
                        label: '销量:',
                        required: true
                    }
                },
                {
                    key: 'amount',
                    type: 'input',
                    templateOptions: {
                        label: '金额:',
                        required: true
                    }
                },
                {
                    key: 'createdate',
                    type: 'dateInput',
                    templateOptions: {
                        label: '创建时间:',
                        required: true
                    }
                },
                {
                    key: 'remark',
                    type: 'textarea',
                    templateOptions: {
                        label: '备注:'
                    }
                }
            ],
            buttons: {
                ok: false,
                reset: false
            },
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
    }).factory("QueryCtrlCode", function (nptRepository) {
        return nptRepository("QueryMdCtrlcode");
    }).config(function (nptBizFilterProviderProvider) {
        nptBizFilterProviderProvider.addConfig('orderFilter', {
            "bizName": "queryOrderList",
            "bizParams": {"instid": "10000001463017"},
            "chains": ["limitTo: 5"]
        });
    });