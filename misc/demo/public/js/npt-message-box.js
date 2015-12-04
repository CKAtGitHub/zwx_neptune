/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("nptMessageBoxApp", ["ui.neptune"])
    .controller("nptMessageBoxDemoController", function ($scope,messageBoxFactory) {
        var vm = this;

        vm.tip = function() {
            messageBoxFactory
                .open({title:"操作成功",
                    content:"成功删除客户：XXX公司"});
        };

        vm.confirm = function() {
            messageBoxFactory.open({title:"确认",
                content:"确定要删除：ID为123的订单吗？",
            action:{

            }});
        };

        vm.useTemplate = function() {
            messageBoxFactory.open({title:"这是标题",
                content:"<div>更多信息请访问：<a href='{{$$ms.url}}'>{{$$ms.url}}</a></div>",
                scope:{
                    url:"http://www.baidu.com"
                }});
        };

        vm.useTemplateUrl = function() {
            messageBoxFactory.open({});
        };

    });
