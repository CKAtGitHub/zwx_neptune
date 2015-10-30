/**
 * Created by leon on 15/10/30.
 */

angular.module("bizPageDemo", ["datatable"])
    .controller("BizPageDemoController", function ($scope, $http) {
        var self = this;
        $scope.data = [];
        $scope.action = [
            {
                name: "view",
                label: "查看"
            }
        ]
        $scope.header = [{
            name: "buyerinstid",
            label: "客户名称"
        }, {
            name: "ordersn",
            label: "订单号"
        }, {
            name: "name",
            label: "订单名称"
        }, {
            name: "purchase",
            label: "购买人"
        }, {
            name: "adviser",
            label: "专属顾问"
        }, {
            name: "salesmanid",
            label: "销售顾问"
        }, {
            name: "orderamount",
            label: "金额"
        }, {
            name: "factamount",
            label: "实际金额"
        }, {
            name: "state",
            label: "订单状态"
        }, {
            name: "createdate",
            label: "创建日期"
        }
        ];


        $scope.orderAction = function (type, item, index) {
            console.info(type);
        }


        /**
         * 打开检查新订单
         */
        $scope.checkNew = function (state) {
            $scope.checkNewIsCollapsed = state;
            $scope.queryIsCollapsed = false;

            if ($scope.checkNewIsCollapsed) {
                $scope.checkNewText = "停止检查";
                $scope.queryState = "checkNew";
            } else {
                $scope.checkNewText = "检查新订单";
            }
        };

        /**
         * 打开自定义查询
         */
        $scope.query = function () {
            $scope.checkNewIsCollapsed = false;
            $scope.queryIsCollapsed = !$scope.queryIsCollapsed;
            $scope.queryState = "query";
        }


        /**
         * 根据参数查询订单列表
         * @param params
         */
        $scope.queryList = function (params, success, error) {
            $http.post("/service", {
                "y9action": {
                    name: "queryOrderList",
                    params: params
                }
            }).success(function (data) {
                $scope.data = data.data;
                success(data);
            }).error(function (data) {
                error(data);
            });
        }


        /**
         * 根据状态查询当前用户机构的订单列表
         */
        $scope.queryByState = function () {

            //关闭新订单检查
            $scope.checkNew(false);

            //将按钮设置为查询中
            self.queryLoading('loading');

            //初始化查询参数
            var params = {
                "instid": "10000001463017",
                "userid": "10000001498059",
            };

            //如果当前查询状态不是全部类型则将状态作为参数传递到服务器查询
            if ($scope.queryState !== "all") {
                params["state"] = $scope.queryState;
            }

            $scope.queryList(params, function () {
                self.queryLoading('reset')
            }, function () {
                self.queryLoading('reset')
            });
        };

        /**
         * 设置界面按钮检索等待状态
         * @param state
         */
        this.queryLoading = function (state) {
            $("#all").button(state);
            $("#waitconfirm").button(state);
            $("#query").button(state);
        }

        //页面第一次打开时查询全部订单
        $scope.queryState = "all";
        $scope.queryByState({
            "instid": "10000001463017",
            "userid": "10000001498059"
        });

        //第一次打开页面时默认为进行订单检查
        $scope.checkNew(true);
    });
