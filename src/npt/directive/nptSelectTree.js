/**
 * Created by leon on 15/11/5.
 */

angular.module("ui.neptune.directive.selectTree", ['ui.bootstrap', 'ui.tree', 'ui.grid', 'ui.grid.selection'])
    .provider("SelectTree", function () {
        this.treeHandler = {};
        this.listHandler = {};

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
                }
            };

            return service;
        };
    })
    .controller("SelectTreeController", function ($scope, $uibModal, SelectTree) {
        this.open = function () {
            var result = $uibModal.open({
                animation: true,
                templateUrl: '/template/select-tree/select-tree-modal.html',
                controller: 'SelectTreeModalController',
                controllerAs: 'vm',
                resolve: {
                    treeData: function ($q) {
                        var deferd = $q.defer();

                        //检索tree
                        SelectTree.treeData($scope.selectType, function (data) {
                            var params = {
                                model: data,
                                selectType: $scope.selectType
                            };
                            deferd.resolve(params);
                        });

                        return deferd.promise;
                    }
                }
            }).result;
            return result;
        };
    })
    .controller("SelectTreeModalController", function ($scope, treeData, SelectTree, $modalInstance) {
        var vm = this;
        // function assignment
        vm.ok = ok;
        vm.cancel = cancel;
        vm.loading = false;

        // variable assignment
        vm.treeData = treeData;

        // function definition
        function ok() {
            var selectData = $scope.gridApi.selection.getSelectedRows();
            $modalInstance.close(selectData);
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        //tree点击
        vm.onTreeClick = function (node) {
            console.info("点击tree");
            vm.loading = true;
            SelectTree.listData(treeData.selectType, node.id, function (data) {
                vm.gridOptions.data = data;
                vm.loading = false;
            }, function (error) {
                vm.loading = false;
            });
        };

        vm.gridOptions = {
            enableRowSelection: true,
            enableSelectAll: false,
            enableFullRowSelection: true,
            selectionRowHeaderWidth: 35,
            rowHeight: 35,
            showGridFooter: true,
            multiSelect: false,
            data: [],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            },
            columnDefs: [
                {name: 'name', displayName: "名称"},
            ]
        };
    })
    .
    directive("nptSelectTree", ["$parse", function ($parse) {
        return {
            restrict: "E",
            transclude: true, //将元素的内容替换到模板中标记了ng-transclude属性的对象上
            replace: true, //使用template的内容完全替换y9ui-datatable(自定义指令标签在编译后的html中将会不存在)
            controller: "SelectTreeController",
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/select-tree/select-tree.html";
            },
            scope: {
                selectType: "@"
            },
            link: function (scope, element, attrs, ctrl) {
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
