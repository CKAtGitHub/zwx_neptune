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
    }]);