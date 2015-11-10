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
    .controller("datatableController", ["$scope", "$attrs", "DatatableConfig", "nptFormStore", "$uibModal", function ($scope, $attrs, datatableConfig, nptFormStore, $uibModal) {
        var self = this;

        this.$datatable = {
            init: function (config, scope) {
                var selfDt = this;

                this.header.init(config.header);
                this.action.init(config.action);
                selfDt.page.init(datatableConfig(), scope);

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
                                target: config[key].target || undefined
                            };
                            this.items.push(action);
                        }
                    }
                },
                items: [],
                onClick: function (action, item, index) {
                    if (action.type === "form") {
                        self.$forms.open(action.target, item);
                    } else {
                        if ($scope.onAction) {
                            $scope.onAction({
                                type: action.name,
                                item: item,
                                index: index
                            });
                        }
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
            items: [],
            element: undefined,
            init: function (config, element) {
                var self = this;
                this.element = element;
                for (var key in config.forms) {
                    this.getForm(config.forms[key], this.builderForm, self);
                }
            },
            getForm: function (name, done, self) {
                //通过formStore获取表单配置
                nptFormStore.form(name, function (config) {
                    done(config, self);
                });
            },
            builderForm: function (config, self) {
                if (config) {
                    var form = {
                        id: config.name,
                        model: {},
                        options: config.options,
                        fields: config.fields
                    };
                    self.items.push(form);
                }
            },
            onSubmit: function onSubmit(id) {
                //form.options.updateInitialValue();
                var form = this.findFormById(id);
                if (form) {
                    alert(JSON.stringify(form.model), null, 2);
                }
            },
            reset: function () {

            },
            open: function (id, data) {
                var form = this.findFormById(id);
                if (form) {

                    var result = $uibModal.open({
                        templateUrl: '/template/datatable/datatable-edit.html',
                        controller: 'editDatatableController',
                        controllerAs: 'vm',
                        resolve: {
                            formData: function () {
                                return {
                                    fields: form.fields,
                                    model: data,
                                    options: form.options
                                };
                            }
                        }
                    }).result;

                    result.then(function (model) {
                        var test = model;
                    });
                }
            },
            close: function (id) {
                $uibModal.close();
            },
            findFormById: function (id) {
                for (var index in self.$forms.items) {
                    if (self.$forms.items[index].id === id) {
                        return self.$forms.items[index];
                    }
                }
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
                onAction: "&" //操作按钮点击回调
            },
            link: function (scope, element, attrs, ctrl) {

                if (scope.options) {
                    ctrl.$datatable.init(scope.options, scope);
                    ctrl.$forms.init(scope.options, element);
                } else {
                    nptDatatableStore.datatable(scope.name, function (config) {
                        ctrl.$datatable.init(config, scope);
                        ctrl.$forms.init(config, element);
                    });
                }

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