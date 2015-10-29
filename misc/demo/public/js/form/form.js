/**
 * Created by leon on 15/10/29.
 */

angular.module("formDemo", ["y9uiForm"])
    .controller("FormDemoController", function ($scope) {
        $scope.config = [
            {
                name: "clientno",
                label: "客户编号",
                type: "text"
            }, {
                name: "clientname",
                label: "客户名称",
                type: "text"
            }, {
                name: "clienttype",
                label: "客户类型",
                type: "text"
            }, {
                name: "sales",
                label: "销售顾问",
                type: "text"
            }, {
                name: "remark",
                label: "备注",
                type: "text"
            }
        ]

        $scope.action = [
            {
                name: "save",
                label: "查看组织"
            },
            {
                name: "reset",
                label: "查看附件"
            }
        ]


        $scope.data = {
            clientno: "DJKJ",
            clientname: "深圳市顶聚科技有限公司",
            clienttype: "A",
            sales: "186",
            remark: "测试客户资料"
        }

        $scope.onClickForm = function (item) {
            console.info(item.label + item.name);
        }
    });