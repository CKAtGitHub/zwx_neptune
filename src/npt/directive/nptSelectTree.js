/**
 * Created by leon on 15/11/5.
 */

angular.module("ui.neptune.directive.selectTree", ['ui.bootstrap', 'ui.tree', 'ui.grid', 'ui.grid.selection'])
    .controller("SelectTreeController", function ($scope, $uibModal) {
        var self = this;

        this.selectTreeApi = {
            open: function () {
                var selfApi = this;
                var result = $uibModal.open({
                    animation: true,
                    templateUrl: '/template/select-tree/select-tree-modal.html',
                    controller: 'SelectTreeModalController',
                    controllerAs: 'vm',
                    resolve: {
                        selectTreeData: function ($q) {
                            var deferd = $q.defer();
                            if (selfApi.treeRepository && selfApi.listRepository) {
                                var params = {
                                    treeRepository: selfApi.treeRepository,
                                    listRepository: selfApi.listRepository
                                };
                                deferd.resolve(params);
                            } else {
                                deferd.reject();
                            }
                            return deferd.promise;
                        }
                    }
                }).result;
                return result;
            }
        };

        //初始化配置
        if ($scope.nptSelectTree) {
            //获取资源仓库
            if ($scope.nptSelectTree.treeRepository) {
                self.selectTreeApi.treeRepository = $scope.nptSelectTree.treeRepository;
            }

            if ($scope.nptSelectTree.listRepository) {
                self.selectTreeApi.listRepository = $scope.nptSelectTree.listRepository;
            }

            if ($scope.nptSelectTree.onRegisterApi) {
                $scope.nptSelectTree.onRegisterApi(this.selectTreeApi);
            }
        }


    })
    .controller("SelectTreeModalController", function ($scope, selectTreeData, $modalInstance,IS) {
        var vm = this;
        // function assignment
        vm.ok = ok;
        vm.cancel = cancel;

        // function definition
        function ok() {
            var selectData = $scope.gridApi.selection.getSelectedRows();
            $modalInstance.close(selectData);
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        vm.refreshTree = function () {
            if (selectTreeData.treeRepository) {
                vm.refresh = selectTreeData.treeRepository.post().then(function (data) {
                    vm.treeData = data;
                });
            }
        };

        vm.refreshList = function (node) {
            if (selectTreeData.listRepository) {
                vm.refresh = selectTreeData.listRepository.post(node).then(function (response) {
                    vm.gridOptions.data = response.data;
                });
            }
        };

        //tree点击
        vm.onTreeClick = function (node) {
            vm.refreshList(node);
        };

        // 解决在手机端，无法选择项目的问题，已选择就自动取消选择了
        var column = {name: 'name', displayName: "名称"};
        if (IS.mobile()) {
            column.cellTemplate = '<div class="ui-grid-cell-contents" title="TOOLTIP" ng-click="$event.preventDefault();$event.stopPropagation();">{{COL_FIELD}}</div>';
        }
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
                column
            ]
        };

        //初始刷新tree
        vm.refreshTree();

    }).directive("nptSelectTree", [function () {
        return {
            restrict: "A",
            transclude: true, //将元素的内容替换到模板中标记了ng-transclude属性的对象上
            replace: true, //使用template的内容完全替换y9ui-datatable(自定义指令标签在编译后的html中将会不存在)
            controller: "SelectTreeController",
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/select-tree/select-tree.html";
            },
            scope: {
                nptSelectTree: "="
            },
            link: function (scope, element, attrs, ctrl) {
            }
        };
    }]).constant("IS",is);
