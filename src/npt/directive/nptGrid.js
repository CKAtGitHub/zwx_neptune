/**
 * Created by leon on 15/11/24.
 */

angular.module("ui.neptune.directive.grid",
    ['ui.grid', "ui.grid.pagination", 'ui.grid.resizeColumns',
        'ui.grid.moveColumns', 'ui.grid.autoResize', 'ngRoute',
        'ng-context-menu', 'ui.bootstrap'])
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
    .controller("GridController", function ($scope, i18nService, $q, $injector, $uibModal, nptFormStore) {
        var vm = this;

        //设置中文
        i18nService.setCurrentLang('zh-cn');

        this.$forms = {
            init: function () {
            },
            open: function (name, data) {
                this.originData = data;

                var result = $uibModal.open({
                    animation: true,
                    templateUrl: '/template/datatable/datatable-edit.html',
                    controller: 'editGridController',
                    controllerAs: 'vm',
                    resolve: {
                        formData: function ($q) {
                            var deferd = $q.defer();
                            nptFormStore.form(name, function (config) {
                                deferd.resolve({
                                    fields: angular.copy(config.fields), //拷贝新版本,防止修改原始配置
                                    model: angular.copy(data), //拷贝新版本,防止修改原始配置
                                    options: angular.copy(config.options) //拷贝新版本,防止修改原始配置
                                });
                            });
                            return deferd.promise;
                        }
                    }
                }).result;

                return result;
            },
            close: function () {
                $uibModal.close();
            }
        };
        $scope.forms = this.$forms;

        function NptGridApi(nptGridOptions) {
            var self = this;
            this.onAddListens = [];
            this.onDelListens = [];
            this.onEditListens = [];
            this.onNoneAction = [];
            this._options = nptGridOptions;
            this._config = {};
            if (nptGridOptions.store) {
                this._config.gridOptions = nptGridOptions.store.gridOptions() || {};
                this._config.action = nptGridOptions.store.action();
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

                // 增加菜单动作
                this.action = {};
                if (this._config.action) {
                    angular.forEach(this._config.action,function(value,key) {
                        self.action[key] = function () {
                            return self.menuAction(value);
                        };
                    });
                }

                //设置数据
                this._config.gridOptions.data = "model";
            }
            // 获取html中配置的监听器
            if ($scope.onAddListens) {
                angular.forEach($scope.onAddListens,function(listener) {
                    if (angular.isFunction(listener)) {
                        self.onAddListens.push(listener);
                    }
                });
            }

            if ($scope.onDelListens) {
                angular.forEach($scope.onDelListens,function(listener) {
                    if (angular.isFunction(listener)) {
                        self.onDelListens.push(listener);
                    }
                });
            }

            if ($scope.onEditListens) {
                angular.forEach($scope.onEditListens,function(listener) {
                    if (angular.isFunction(listener)) {
                        self.onEditListens.push(listener);
                    }
                });
            }
            if ($scope.onNoneAction) {
                angular.forEach($scope.onNoneAction,function(listener) {
                    if (angular.isFunction(listener)) {
                        self.onNoneAction.push(listener);
                    }
                });
            }

            // 定义框架支持的菜单操作
            this._handler = {
                add: function (action, item, index) {
                    var result = vm.$forms.open(action.target, {});
                    if (result) {
                        result = result.then(function (data) {
                            var params = {
                                action: action,
                                index: index,
                                data: data
                            };

                            var promisesArr = [];
                            angular.forEach(self.onAddListens, function (value) {
                                if (angular.isFunction(value)) {
                                    promisesArr.push($q.when($injector.invoke(value, this, {
                                        "params": params
                                    })));
                                }
                            });

                            //配置中的listen
                            angular.forEach(action.listens, function (value) {
                                promisesArr.push($q.when($injector.invoke(value, this, {
                                    "params": params
                                })));
                            });

                            $q.all(promisesArr).then(function () {
                                //执行成功,将数据添加到表格
                                $scope.model.unshift(params.data);
                                console.info("添加执行成功.");
                            }, function (error) {
                                console.info("添加执行失败!" + JSON.stringify(error));
                            });

                        }, function (error) {
                            console.info("添加操作取消");
                        });
                        return result;
                    }
                },
                del: function (action, item, index) {
                    var deferd = $q.defer();
                    var promise = deferd.promise;

                    var params = {
                        action: action,
                        item: item,
                        index: index
                    };

                    deferd.resolve(params);

                    promise.then(function (data) {
                        console.info("开始删除数据");
                    }, function (error) {
                        console.info("删除数据错误!" + error);
                    });

                    var promisesArr = [promise];
                    angular.forEach(self.onDelListens, function (value) {
                        if (angular.isFunction(value)) {
                            promisesArr.push($q.when($injector.invoke(value, this, {
                                "params": params
                            })));
                        }
                    });

                    //配置中的listen
                    angular.forEach(action.listens, function (value) {
                        promisesArr.push($q.when($injector.invoke(value, this, {
                            "params": params
                        })));
                    });

                    var result = $q.all(promisesArr).then(function () {
                        $scope.model.splice(params.index, 1);
                    }, function (error) {
                        console.info("删除失败!" + error);
                    });

                    return result;
                },
                edit: function (action, item, index) {
                    var result = vm.$forms.open(action.target, item);
                    if (result) {
                        result.then(function (data) {
                            //重新组织参数
                            var params = {
                                action: action,
                                index: index,
                                data: data,
                                item: angular.copy(item) //防止修改
                            };
                            var promisesArr = [];
                            angular.forEach(self.onEditListens, function (value) {
                                if (angular.isFunction(value)) {
                                    promisesArr.push($q.when($injector.invoke(value, this, {
                                        "params": params
                                    })));
                                }
                            });

                            //配置中的listen
                            angular.forEach(action.listens, function (value) {
                                promisesArr.push($q.when($injector.invoke(value, this, {
                                    "params": params
                                })));
                            });

                            $q.all(promisesArr).then(function (data) {
                                console.info("编辑操作成功!");
                                //将新数据更新到表格
                                angular.extend(item, params.data);
                            }, function (error) {
                                console.info("编辑操作失败!");
                            });

                        }, function (error) {
                            console.info("编辑操作取消");
                        });
                    }

                    return result;
                },
                none: function (action, item, index) {
                    var params = {
                        action: action,
                        item: angular.copy(item),
                        index: index
                    };
                    var promisesArr = [];
                    angular.forEach(self.onNoneAction, function (value) {
                        if (angular.isFunction(value)) {
                            promisesArr.push($q.when($injector.invoke(value, this, {
                                "params": params
                            })));
                        }
                    });
                    //配置中的listen
                    angular.forEach(action.listens, function (value) {
                        promisesArr.push($q.when($injector.invoke(value, this, {
                            "params": params
                        })));
                    });

                    $q.all(promisesArr).then(function (data) {
                        console.info("操作成功!");
                    }, function (error) {
                        console.info("操作失败!");
                    });
                }
            };
        }

        NptGridApi.prototype.gridOptions = function () {
            return this._config.gridOptions;
        };

        NptGridApi.prototype.getMenus = function () {
            return this._config.action;
        };

        NptGridApi.prototype.menuAction = function (menu) {
            var selectedData = this.uiGridApi.selection.getSelectedRows();
            if (selectedData.length === 0) {
                return;
            }
            if (this._handler[menu.type]) {
                this._handler[menu.type](menu, selectedData[0],selectedData[0].$index - 1);
            } else {
                this._handler.none(menu, selectedData);
            }
        };


        vm.init = function (nptGrid) {
            //创建API
            vm.nptGridApi = new NptGridApi(nptGrid);
            vm.gridOptions = vm.nptGridApi.gridOptions();
            vm.action = vm.nptGridApi.getMenus();

            //观察data变化计算行号
            $scope.$watch("model", function (newValue) {
                if (newValue) {
                    var index = 1;
                    angular.forEach(newValue, function (value) {
                        value.$index = index++;
                    });
                }
            },true);
        };

        vm.menuAction = function (menu) {
            vm.nptGridApi.menuAction(menu);
        };

        if ($scope.nptGrid) {
            vm.init($scope.nptGrid);
        }
    })
    .controller("editGridController", function ($uibModalInstance, formData) {
        var vm = this;
        // function assignment
        vm.ok = ok;
        vm.cancel = cancel;

        // variable assignment
        vm.formData = formData;
        vm.originalFields = angular.copy(vm.formData.fields);

        // function definition
        function ok() {
            $uibModalInstance.close(vm.formData.model);
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
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
                nptGrid: "=",
                onNoneAction: "=",
                onAddListens: "=",
                onEditListens: "=",
                onDelListens: "=",
                model: "="
            }
        };
    });