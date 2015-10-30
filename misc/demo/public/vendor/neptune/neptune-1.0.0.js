/**
 * Created by leon on 15/10/28.
 */

angular.module("datatable", ['ui.bootstrap'])
    .constant('y9uiDatatableConfig', {
        currPage: 1,
        maxSize: 10,
        itemsPerPage: 5,
        isIndex: false,
        isPagination: false
    })
    .controller("datatableControll", ["$scope", "$attrs", function ($scope, $attrs) {
        var self = this;
        this.init = function (config) {
            //初始化参数
            this.config = config;
            $scope.currPage = $scope.currPage || config.currPage;
            $scope.totalItems = $scope.data.length || 0;
            $scope.maxSize = config.maxSize;
            $scope.itemsPerPage = $scope.itemsPerPage || config.itemsPerPage;
            $scope.pageData = [];
            $scope.isIndex = $scope.isIndex || config.isIndex;
            $scope.isPagination = $scope.isPagination || config.isPagination;

            //$scope.$watch("data", function (newValue, oldValue) {
            //    //如果存在数据则出发第一页
            //    if (angular.isDefined(newValue) && newValue.length > 0) {
            //        self.pageChange();
            //    }
            //}, true);

            //监控数据集合是否发生改变
            $scope.$watchCollection("data", function (newValue, oldValue) {
                //如果存在数据则出发第一页
                if (angular.isDefined(newValue) && newValue.length > 0) {
                    //刷新总行数
                    $scope.totalItems = newValue.length;
                    self.pageChange();
                }
            });
        };

        this.pageChange = function () {
            //初始化分页数据
            $scope.pageData = [];
            var endIndex = 0;
            var beginIndex = 0;

            if ($scope.isPagination) {
                endIndex = $scope.currPage * $scope.itemsPerPage;
                beginIndex = $scope.currPage * $scope.itemsPerPage - $scope.itemsPerPage;
            } else {
                beginIndex = 0;
                endIndex = data.length;
            }

            for (beginIndex; beginIndex < endIndex; beginIndex++) {
                if (beginIndex >= $scope.data.length) {
                    break;
                } else {
                    $scope.pageData.push($scope.data[beginIndex]);
                }
            }
        };

        //分页触发页面数据变更
        $scope.onPageChange = function () {
            self.pageChange();
        };


        //回调绑定动作方法
        $scope.doAction = function (type, item, index) {
            //要求绑定时必须使用type作为参数名称)
            if ($scope.onAction) {
                $scope.onAction({
                    type: type,
                    item: item,
                    index: index
                });
            }
        };
    }])
    .directive("y9uiDatatable", ["y9uiDatatableConfig", function (datatableConfig) {
        return {
            restrict: "E",
            controller: "datatableControll",
            transclude: true, //将元素的内容替换到模板中标记了ng-transclude属性的对象上
            replace: true, //使用template的内容完全替换y9ui-datatable(自定义指令标签在编译后的html中将会不存在)
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/datatable/datatable.html";
            },
            scope: {
                header: "=", //标题配置
                data: "=",   //表格数据
                action: "=", //操作按钮
                isIndex: "=?", //是否显示序号
                isPagination: "@",//是否分页
                itemsPerPage: "=?", //每页显示行数
                onAction: "&" //操作按钮点击回调
            },
            link: function (scope, element, attrs, ctrl) {
                ctrl.init(datatableConfig);
            }
        };
    }]);;/**
 * Created by leon on 15/10/29.
 */

angular.module("y9uiForm", ["ui.bootstrap"])
    .controller("FormControllect", ["$scope", function ($scope) {

        this.init = function () {

        };

        $scope.doAction = function (item) {
            if (angular.isDefined($scope.onClickAction)) {
                $scope.onClickAction({
                    item: item
                });
            }
        };

        $scope.doSave = function () {
            console.info("保存表单");
        };

        $scope.doReset = function () {
            console.info("重置表单");
        };

    }])
    .directive("y9uiForm", [function () {
        return {
            restrict: "E",
            controller: "FormControllect",
            replace: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/form/form.html";
            },
            scope: {
                config: "=",
                data: "=",
                action: "=",
                onClickAction: "&",
                onSave: "&",
                onReset: "&"
            },
            link: function (scope, element, attrs, ctrl) {
                ctrl.init();
            }
        };
    }]);;angular.module("/template/datatable/datatable.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/template/datatable/datatable.html",
    "<div><div style=\"padding-top:10px;\" class=\"row\"><div class=\"col-md-12\"><!-- 设置为响应式表格 当页面宽度不够显示表格内容时会出现滚动条--><div class=\"table-responsive\"><!-- table-striped表示隔行显示不同颜色条纹；table-hover鼠标悬停变色；table-bordered表格线框;table-condensed紧缩表格--><table class=\"table table-striped table-bordered table-hover table-condensed\"><tfoot><tr ng-show=\"isPagination\"><td colspan=\"50\"><uib-pagination style=\"margin:0px;\" total-items=\"totalItems\" ng-model=\"currPage\" items-per-page=\"itemsPerPage\" ng-change=\"onPageChange()\" max-size=\"maxSize\" boundary-links=\"true\" first-text=\"首页\" previous-text=\"上一页\" next-text=\"下一页\" last-text=\"尾页\" class=\"pagination-sm\"></uib-pagination></td></tr></tfoot><thead><tr ng-show=\"isPagination\"><td colspan=\"50\"><uib-pagination style=\"margin:0px;\" total-items=\"totalItems\" ng-model=\"currPage\" items-per-page=\"itemsPerPage\" ng-change=\"onPageChange()\" max-size=\"maxSize\" boundary-links=\"true\" first-text=\"首页\" previous-text=\"上一页\" next-text=\"下一页\" last-text=\"尾页\" class=\"pagination-sm\"></uib-pagination></td></tr><tr><th ng-if=\"isIndex\" class=\"text-center\">&#24207;&#21495;</th><th ng-repeat=\"item in header\" class=\"text-center\">{{item.label}}</th><th ng-if=\"action.length&gt;0\" class=\"text-center\">&#25805;&#20316;</th></tr></thead><tbody><tr ng-repeat=\"item in pageData\"><td ng-if=\"isIndex\" class=\"text-center\">{{($index+1)+(currPage * itemsPerPage - itemsPerPage\n" +
    ")}}</td><td ng-repeat=\"headerItem in header\">{{item[headerItem.name]}}</td><td ng-if=\"action.length&gt;0\"><a ng-repeat=\"actionItem in action\" href=\"\" ng-click=\"doAction(actionItem.name,item,currPage * itemsPerPage - itemsPerPage + $parent.$index)\" class=\"btn btn-primary btn-sm\">{{actionItem.label}}</a></td></tr></tbody></table></div></div></div></div>");
}]);

angular.module("/template/form/form.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/template/form/form.html",
    "<form class=\"form-horizontal\"><div ng-repeat=\"item in config\" class=\"form-group\"><label for=\"{{item.name}}\" class=\"col-sm-2 control-label\">{{item.label}}</label><div class=\"col-sm-10\"><input id=\"{{item.name}}\" type=\"{{item.type || text}}\" placeholder=\"{{item.label}}\" value=\"{{data[item.name]}}\" class=\"form-control\"></div></div><div class=\"form-group\"><div class=\"col-sm-offset-2 col-sm-10\"><button type=\"button\" ng-click=\"doSave()\" class=\"btn btn-primary\">保存</button>&nbsp<button type=\"button\" ng-click=\"doReset()\" class=\"btn btn-danger\">重置</button>&nbsp\n" +
    "&nbsp\n" +
    "&nbsp\n" +
    "&nbsp<button type=\"button\" ng-repeat=\"item in action\" ng-click=\"doAction(item)\" class=\"btn btn-default\">{{item.label}}</button></div></div></form>");
}]);
