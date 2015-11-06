/**
 * Created by leon on 15/11/5.
 */

angular.module("ui.neptune.directive.selectTree", ['ui.bootstrap', 'ui.tree'])
    .provider("SelectTreeConfig", function () {
        this.treeHandler = {};

        this.listHandler = {};

        this.defaultListHeader = [
            {
                name: "name",
                label: "姓名"
            }
        ];

        this.listHeader = {};

        this.defaultListAction = [
            {
                name: "select",
                label: "选择"
            }
        ];

        this.listAction = {};

        this.setTreeHandler = function (type, handler) {
            if (type && handler) {
                this.treeHandler[type] = handler;
            }
        };

        this.setListHandler = function (type, handler) {
            if (type && handler) {
                this.listHandler[type] = handler;
            }
        };

        this.$get = function (nptResource) {
            var self = this;

            var service = {
                treeData: function (type, done) {
                    if (self.treeHandler[type] && done) {
                        self.treeHandler[type](nptResource, done);
                    }
                },
                listData: function (type, id, done) {
                    if (self.listHandler[type] && done) {
                        self.listHandler[type](nptResource, id, done);
                    }
                },
                listHeader: function (type) {
                    if (self.listHeader[type]) {
                        return self.listHeader[type];
                    } else {
                        return self.defaultListHeader;
                    }
                },
                listAction: function (type) {
                    if (self.listAction[type]) {
                        return self.listAction[type];
                    } else {
                        return self.defaultListAction;
                    }
                }
            };

            return service;
        };
    })
    .controller("SelectTreeController", ["$scope", "nptResource", function ($scope) {

        this.init = function (element) {
            $scope.element = element;
            $scope.modalElement = $(element).find(".modal");
        };

        this.close = function () {
            $scope.modalElement.modal('hide');
        };

        this.open = function () {
            $scope.modalElement.modal("show");
        };
    }])
    .directive("nptSelectTree", ["$parse", "SelectTreeConfig", function ($parse, selectTreeConfig) {
        return {
            restrict: "E",
            controller: "SelectTreeController",
            transclude: true, //将元素的内容替换到模板中标记了ng-transclude属性的对象上
            replace: true, //使用template的内容完全替换y9ui-datatable(自定义指令标签在编译后的html中将会不存在)
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/select-tree/select-tree.html";
            },
            scope: {
                onSelect: "&",
                selectType: "@"
            },
            link: function (scope, element, attrs, ctrl) {
                //初始化
                ctrl.init(element);

                scope.close = ctrl.close;

                scope.listHeader = selectTreeConfig.listHeader(scope.selectType);
                scope.listAction = selectTreeConfig.listAction(scope.selectType);

                selectTreeConfig.treeData(scope.selectType, function (data) {
                    scope.treeData = data;
                });


                //tree点击
                scope.onTreeClick = function (node) {
                    console.info("点击tree");
                    selectTreeConfig.listData(scope.selectType, node.id, function (data) {
                        scope.listData = data;
                    });
                };

                scope.onListSelect = function (type, item, index) {
                    console.info("点击list");
                    if (scope.onSelect) {
                        scope.onSelect({
                            type: type,
                            item: item,
                            index: index
                        });
                    }
                    ctrl.close();
                };

                if (attrs.name && scope.$parent) {
                    var setter = $parse(attrs.name).assign;
                    setter(scope.$parent, ctrl);
                }
            }
        };
    }]);
