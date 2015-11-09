/**
 * Created by leon on 15/10/28.
 */
angular.module("datatableDemo", ["ui.neptune", "datatableStoreDemo", "formStoreDemo"])
    .controller("DatatableDemoController", function ($scope) {
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