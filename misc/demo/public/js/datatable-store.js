/**
 * Created by leon on 15/11/9.
 */

angular.module("datatableStoreDemo", ["ui.neptune"]).
    run(function (nptDatatableStore) {

        //store.datatable("name")
        //    .header(function () {
        //
        //    })
        //    .action(function{
        //
        //    });

        nptDatatableStore.putDatatable("demodt", {
            header: {
                sn: {
                    label: "订单编号"
                },
                state: {
                    label: "订单状态"
                },
                clientid: {
                    label: "客户编号"
                },
                sales: {
                    label: "销售顾问"
                },
                amount: {
                    label: "订单金额"
                },
                createdate: {
                    label: "创建日期"
                },
                remark: {
                    label: "备注"
                }
            },
            action: {
                view: {
                    label: "查看",
                    type: "none"
                },
                add: {
                    label: "添加",
                    type: "add",
                    target: "demo"
                },
                del: {
                    label: "删除",
                    type: "del"
                },
                edit: {
                    label: "编辑",
                    type: "edit",
                    target: "order"
                }
            }
        });
    });
