/**
 * Created by leon on 15/11/2.
 */

angular.module("orderConfig", ["bizModule"])
    .config(function (bizModuleConfigProvider) {
        bizModuleConfigProvider.reg("order", {
            "header": [
                {
                    "name": "buyerinstid",
                    "label": "客户名称"
                },
                {
                    "name": "ordersn",
                    "label": "订单号"
                },
                {
                    "name": "name",
                    "label": "订单名称"
                },
                {
                    "name": "purchase",
                    "label": "购买人"
                },
                {
                    "name": "adviser",
                    "label": "专属顾问"
                },
                {
                    "name": "salesmanid",
                    "label": "销售顾问"
                },
                {
                    "name": "orderamount",
                    "label": "金额"
                },
                {
                    "name": "factamount",
                    "label": "实际金额"
                },
                {
                    "name": "state",
                    "label": "订单状态"
                },
                {
                    "name": "createdate",
                    "label": "创建日期"
                }
            ],
            "action": [
                {
                    "name": "view",
                    "label": "查看",
                    "link": "#/detail"
                }
            ]
        }).reg("orderProduct", {
            header: [
                {
                    name: "productname",
                    label: "产品名称"
                }, {
                    name: "productIntroduce",
                    label: "产品简介"
                },
                {
                    name: "goodsamount",
                    label: "产品价格"
                }, {
                    name: "productclassifyname",
                    label: "已选分类"
                }
            ]
        }).reg("orderWorkOrder", {
            header: [
                {
                    name: "descr",
                    label: "工单名称"
                }, {
                    name: "inserviceName",
                    label: "服务状态"
                }, {
                    name: "descr",
                    label: "进度"
                }, {
                    name: "assignedInfo",
                    label: "分配信息"
                }
            ],
            action: [
                {
                    name: "view",
                    label: "查看"
                }
            ]
        });
    });