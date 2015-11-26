/**
 * Created by leon on 15/11/24.
 */

angular.module("ui.neptune.directive.grid", ['ui.grid', "ui.grid.pagination", 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.grid.autoResize', 'ngRoute', 'ng-context-menu'])
    .provider("nptGridStore", function () {

        this.$get = function () {

            function NptGridStore(name, setting) {
                if (!name) {
                    throw new Error("npt grid store must set name.");
                }
                this._name = name;
                if (setting) {
                    this.setting(setting);
                }
            }

            NptGridStore.prototype.setting = function (setting) {
                this._gridOptions = {
                    paginationPageSizes: [10, 20, 30],
                    paginationPageSize: 10,
                    showGridFooter: true,
                    showColumnFooter: true,
                    //enableSorting: false,
                    enableRowSelection: true,
                    enableSelectAll: false,
                    multiSelect: false,
                    enableFullRowSelection: true,
                    selectionRowHeaderWidth: 35,
                    rowHeight: 35,
                    rowTemplate: "/template/grid/npt-grid-row.html"
                };
                this._gridOptions = angular.extend(setting.gridOptions, this._gridOptions);
                this._action = setting.action;
            };

            NptGridStore.prototype.gridOptions = function () {
                return this._gridOptions;
            };

            NptGridStore.prototype.action = function () {
                return this._action;
            };

            function nptGridStoreFactory(name, setting) {
                return new NptGridStore(name, setting);
            }

            return nptGridStoreFactory;
        };

    })
    .controller("GridController", function ($scope, i18nService) {
        var vm = this;

        //设置中文
        i18nService.setCurrentLang('zh-cn');

        $scope.onAction = function (grid, row, col, rowIndex) {
            //var a = col.row.index;
        };

        function NptGridApi(nptGridOptions) {
            var self = this;
            this._options = nptGridOptions;
            this._config = {};
            if (nptGridOptions.store) {
                this._config.gridOptions = nptGridOptions.store.gridOptions() || {};
                this._config.action = nptGridOptions.store.action() || {};
                //设置注册Api回调,如果用户在配置中设置会被替换
                this._config.gridOptions.onRegisterApi = function (uiGridApi) {
                    self.uiGridApi = uiGridApi;


                    //如果存在注册Api回调则执行
                    if (self._options.onRegisterApi) {
                        self._options.onRegisterApi(self);
                    }
                };

                //添加操作区域
                this._config.gridOptions.columnDefs.push({
                    field: 'actionScope',
                    displayName: "操作",
                    width: 100,
                    cellTemplate: "/template/grid/npt-grid-row-cell.html"
                });

                //添加序号区域,
                this._config.gridOptions.columnDefs.unshift({
                    field: '$index',
                    displayName: "序号",
                    enableSorting: true,
                    width: 60
                });

                //设置数据
                this._config.gridOptions.data = nptGridOptions.data || [];
            }
        }

        NptGridApi.prototype.gridOptions = function () {
            return this._config.gridOptions;
        };

        NptGridApi.prototype.action = function () {
            return this._config.action;
        };

        vm.init = function (nptGrid) {
            //创建API
            vm.nptGridApi = new NptGridApi(nptGrid);
            vm.gridOptions = vm.nptGridApi.gridOptions();
            vm.action = vm.nptGridApi.action();

            //观察data变化计算行号
            $scope.$watch("vm.gridOptions.data", function (newValue) {
                if (newValue) {
                    var index = 1;
                    angular.forEach(newValue, function (value) {
                        value.$index = index++;
                    });
                }
            });
        };

        vm.menuAction = function (key) {
            console.log(this.action[key]);
        };

        if ($scope.nptGrid) {
            vm.init($scope.nptGrid);
        }
    })
    .directive("nptGrid", function () {
        return {
            restrict: "EA",
            controller: "GridController as vm",
            replace: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/grid/npt-grid.html";
            },
            scope: {
                nptGrid: "="
            }
        };
    });