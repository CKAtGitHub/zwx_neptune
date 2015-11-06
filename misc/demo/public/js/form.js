/**
 * Created by leon on 15/10/29.
 */

angular.module("formDemo", ["ui.neptune"])
    .config(function (ModelConfigProvider) {
        ModelConfigProvider.model("demoForm", {
            header: [
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
                    name: "email",
                    label: "电子邮件",
                    type: "email"
                }, {
                    name: "regamount",
                    label: "注册资金",
                    type: "number"
                }, {
                    name: "homepage",
                    label: "企业网站",
                    type: "url"
                }, {
                    name: "phonenumber",
                    label: "联系电话",
                    type: "tel"
                },
                {
                    name: "remark",
                    label: "备注",
                    type: "textarea"
                }
            ],
            action: [
                {
                    name: "save",
                    label: "查看组织"
                },
                {
                    name: "reset",
                    label: "查看附件"
                }
            ]
        })
    })
    .controller("FormDemoController", function ($scope) {
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