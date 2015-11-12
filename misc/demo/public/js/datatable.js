/**
 * Created by leon on 15/10/28.
 */
angular.module("datatableDemo", ["ui.neptune", "datatableStoreDemo", "formStoreDemo"])
    .controller("DatatableDemoController", function ($scope) {
        $scope.orderAction = function (action, item, index) {
            console.info(JSON.stringify(item));
        };

        $scope.onDelListens = [function ($q, $timeout, params) {
            var deferd = $q.defer();

            console.info("开始执行后台数据库删除!");
            $timeout(function () {
                if (params.index === 0) {
                    deferd.reject("第一行不能删除!");
                } else {
                    deferd.resolve("删除成功!");
                }
            }, 500);

            return deferd.promise;
        }];

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