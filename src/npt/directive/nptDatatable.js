/**
 * Created by leon on 15/10/28.
 */

angular.module("ui.neptune.directive.datatable", ['ui.bootstrap', "formly", "formlyBootstrap"])
    .constant("DatatableConfig", function () {
        return {
            currPage: 1,
            maxSize: 10,
            itemsPerPage: 5,
            isIndex: false,
            isPagination: false
        };
    })
    .controller("datatableController", ["$scope", "$attrs", "DatatableConfig", "nptFormStore", "$uibModal", "$q", "$injector", function ($scope, $attrs, datatableConfig, nptFormStore, $uibModal, $q, $injector) {
        var self = this;

        if ($scope.controller) {
            $scope.controller = this;
        }

        this.$datatable = {
            init: function (config, scope) {
                var selfDt = this;

                this.header.init(config.header);
                this.action.init(config.action);
                selfDt.page.init(datatableConfig(), scope);

                if (scope.onAddListens) {
                    for (var i in scope.onAddListens) {
                        this.putAddListen(scope.onAddListens[i]);
                    }
                }

                if (scope.onDelListens) {
                    for (var j in scope.onDelListens) {
                        this.putDelListen(scope.onDelListens[j]);
                    }
                }

                if (scope.onEditListens) {
                    for (var k in scope.onEditListens) {
                        this.putEditListen(scope.onEditListens[k]);
                    }
                }

            },
            putAddListen: function (listen) {
                if (typeof listen === "function") {
                    this.onAddListens.push(listen);
                }
            },
            putDelListen: function (listen) {
                if (typeof listen === "function") {
                    this.onDelListens.push(listen);
                }
            },
            putEditListen: function (listen) {
                if (typeof listen === "function") {
                    this.onEditListens.push(listen);
                }
            },
            onAddListens: [],
            onDelListens: [],
            onEditListens: [],
            handler: {
                add: function (action, item, index) {
                    var result = self.$forms.open(action.target, {});
                    if (result) {
                        result = result.then(function (data) {
                            var params = {
                                action: action,
                                index: index,
                                data: data
                            };

                            var promisesArr = [];
                            angular.forEach(self.$datatable.onAddListens, function (value) {
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
                                $scope.data.push(params.data);
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
                    angular.forEach(self.$datatable.onDelListens, function (value) {
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
                        $scope.data.splice(params.index, 1);
                    }, function (error) {
                        console.info("删除失败!" + error);
                    });

                    return result;
                },
                edit: function (action, item, index) {
                    var result = self.$forms.open(action.target, item);
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
                            angular.forEach(self.$datatable.onEditListens, function (value) {
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
                    if ($scope.onAction) {
                        $scope.onAction({
                            action: action,
                            item: item,
                            index: index
                        });
                    }
                }
            },
            header: {
                init: function (config) {
                    if (config) {
                        for (var key in config) {
                            this.items.push({
                                name: key,
                                label: config[key].label
                            });
                        }
                    }
                },
                items: []
            },
            action: {
                init: function (config) {
                    if (config) {
                        for (var key in config) {
                            var action = {
                                name: key,
                                label: config[key].label,
                                type: config[key].type || "none",
                                target: config[key].target || undefined,
                                listens: config[key].listens || []
                            };
                            this.items.push(action);
                        }
                    }
                },
                items: [],
                onClick: function (action, item, index) {
                    if (self.$datatable.handler[action.type]) {
                        self.$datatable.handler[action.type](action, item, index);
                    }
                }
            },
            page: {
                init: function (config, scope) {
                    this.currPage = scope.currPage || config.currPage;
                    this.totalItems = 0;
                    if (scope.data) {
                        this.totalItems = scope.data.length || 0;
                    }
                    this.maxSize = config.maxSize;
                    this.itemsPerPage = scope.itemsPerPage || config.itemsPerPage;

                    this.isIndex = scope.isIndex || config.isIndex;
                    this.isPagination = scope.isPagination || config.isPagination;
                },
                data: [],
                pageChange: function (data) {
                    //初始化分页数据
                    this.data = [];
                    var endIndex = 0;
                    var beginIndex = 0;

                    if (this.isPagination) {
                        endIndex = this.currPage * this.itemsPerPage;
                        beginIndex = this.currPage * this.itemsPerPage - this.itemsPerPage;
                    } else {
                        beginIndex = 0;
                        endIndex = 0;
                        if (data) {
                            endIndex = data.length;
                        }
                    }

                    if (data) {
                        for (beginIndex; beginIndex < endIndex; beginIndex++) {
                            if (beginIndex >= data.length) {
                                break;
                            } else {
                                this.data.push(data[beginIndex]);
                            }
                        }
                    }
                }
            }
        };
        $scope.datatable = this.$datatable;

        this.$forms = {
            init: function () {
            },
            open: function (name, data) {
                this.originData = data;
                var formData = {};
                angular.copy(data, formData);

                var result = $uibModal.open({
                    animation: true,
                    templateUrl: '/template/datatable/datatable-edit.html',
                    controller: 'editDatatableController',
                    controllerAs: 'vm',
                    resolve: {
                        formData: function ($q) {
                            var deferd = $q.defer();
                            nptFormStore.form(name, function (config) {
                                deferd.resolve({
                                    fields: config.fields,
                                    model: formData,
                                    options: config.options
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
    }])
    .controller("editDatatableController", function ($modalInstance, formData) {
        var vm = this;
        // function assignment
        vm.ok = ok;
        vm.cancel = cancel;

        // variable assignment
        vm.formData = formData;
        vm.originalFields = angular.copy(vm.formData.fields);

        // function definition
        function ok() {
            $modalInstance.close(vm.formData.model);
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    })
    .directive("nptDatatable", ['$parse', "nptDatatableStore", function ($parse, nptDatatableStore) {
        return {
            restrict: "E",
            controller: "datatableController",
            transclude: true, //将元素的内容替换到模板中标记了ng-transclude属性的对象上
            replace: true, //使用template的内容完全替换y9ui-datatable(自定义指令标签在编译后的html中将会不存在)
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/datatable/datatable.html";
            },
            scope: {
                name: "@",
                options: "=?", //标题配置
                data: "=",   //表格数据
                isIndex: "=?", //是否显示序号
                isPagination: "@",//是否分页
                itemsPerPage: "=?", //每页显示行数
                controller: "=",
                onAction: "&",
                onAddListens: "=",
                onEditListens: "=",
                onDelListens: "="
            },
            link: function (scope, element, attrs, ctrl) {
                if (scope.options) {
                    ctrl.$datatable.init(scope.options, scope);

                } else {
                    nptDatatableStore.datatable(scope.name, function (config) {
                        ctrl.$datatable.init(config, scope);
                    });
                }

                ctrl.$forms.init();

                //监控数据集合是否发生改变
                scope.$watchCollection("data", function (newValue, oldValue) {
                    //如果存在数据则出发第一页
                    if (angular.isDefined(newValue) && newValue !== null) {
                        //刷新总行数
                        ctrl.$datatable.page.totalItems = newValue.length;
                        ctrl.$datatable.page.pageChange(scope.data);
                    }
                });

                scope.$watch("datatable.page.currPage", function (newValue, oldValue) {
                    ctrl.$datatable.page.pageChange(scope.data);
                });

                if (attrs.name && scope.$parent) {
                    var setter = $parse(attrs.name).assign;
                    setter(scope.$parent, ctrl);
                }
            }
        };
    }]);