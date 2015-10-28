/**
 * Created by leon on 15/10/28.
 */

angular.module("datatable", [])
    .controller("datatableControll", function ($scope) {
        this.hello = function (name) {
            return "hello " + name;
        }

        /**
         * 添加一行数据
         * @param data
         */
        this.add = function (data) {

        }

        /**
         * 删除一行数据
         */
        this.del = function (index) {

        }


    })
    .directive("y9uiDatatable", function () {
        return {
            restrict: "E",
            controller: "datatableControll",
            transclude: true, //将元素的内容替换到模板中标记了ng-transclude属性的对象上
            replace: true, //使用template的内容完全替换y9ui-datatable(自定义指令标签在编译后的html中将会不存在)
            templateUrl: function (element, attrs) {
                return attrs.templateUrl;
            },
            scope: {
                config: "=",
                data: "=",
                action: "&"
            },
            link: function (scope, element, attrs, ctrl) {
                scope.page = {
                    currPage: attrs.currPage || 1,
                    rowNum: attrs.rowNum || 5
                }

                scope.doAction = function (type) {
                    //要求绑定时必须使用type作为参数名称
                    scope.action({
                        type: type
                    });
                }
            }
        }
    });