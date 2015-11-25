/**
 * Created by leon on 15/11/24.
 */

angular.module("nptGridApp", ["ui.neptune"])
    .factory("DemoNptGrid", function (nptGridStore, uiGridConstants) {
        return nptGridStore("DemoNptGrid", {
            gridOptions: {
                columnDefs: [
                    {field: 'sn', displayName: "订单编号", width: 150},
                    {field: 'state', displayName: "订单状态", width: 80},
                    {field: 'clientid', displayName: "客户名称", enableSorting: false},
                    {field: 'sales', displayName: "业务员", cellFilter: "cacheFilter:'user':'name':'id'"},
                    {field: 'amount', displayName: "订单金额", aggregationType: uiGridConstants.aggregationTypes.sum},
                    {field: 'createdate', displayName: "创建日期"},
                    {field: 'remark', displayName: "备注"}
                ],
                enableGridMenu: true,
                gridMenuCustomItems: [
                    {
                        title: "添加",
                        action: function ($event) {

                        },
                        leaveOpen: false
                    }
                ]
            }
        })
    })
    .controller("nptGridDemoController", function (DemoNptGrid, $scope) {
        var vm = this;

        vm.nptGridOptions = {
            store: DemoNptGrid,
            data: [],
            onRegisterApi: function (nptGridApi) {
                vm.nptGridApi = nptGridApi;
            }
        };

        for (var i = 0; i < 10000; i++) {
            vm.nptGridOptions.data.push({
                "sn": "DD20150101000" + i,
                "state": "buy",
                "clientid": "10000002315692",
                "sales": "10000001498059",
                "amount": 10938.88 + i,
                "createdate": (new Date().getTime() + 1000 * i),
                "remark": "测试数据表格配置"
            });
        }
    });