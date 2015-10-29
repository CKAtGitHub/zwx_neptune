/**
 * Created by leon on 15/10/28.
 */

angular.module("datatableDemo", ["datatable"])
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
        }

        $scope.action = [
            {
                name: "view",
                label: "查看"
            },
            {
                name: "add",
                label: "添加"
            },
            {
                name: "del",
                label: "删除"
            }
        ]

        $scope.header = [
            {
                name: "sn",
                label: "订单编号"
            },
            {
                name: "state",
                label: "订单状态"
            },
            {
                name: "clientid",
                label: "客户编号"
            },
            {
                name: "sales",
                label: "销售顾问"
            },
            {
                name: "amount",
                label: "订单金额"
            },
            {
                name: "createdate",
                label: "创建日期"
            },
            {
                name: "remark",
                label: "备注"
            }
        ]

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