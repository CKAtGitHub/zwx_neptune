/**
 * Created by leon on 15/10/28.
 */

angular.module("ui.neptune.directive.datatable", ['ui.bootstrap'])
    .constant("DatatableConfig", function () {
        return {
            currPage: 1,
            maxSize: 10,
            itemsPerPage: 5,
            isIndex: false,
            isPagination: false
        };
    })
    .controller("datatableController", ["$scope", "$attrs", "nptDatatableStore", "DatatableConfig", "nptFormStore", function ($scope, $attrs, nptDatatableStore, datatableConfig, nptFormStore) {
        var self = this;

        this.$datatable = {
            init: function (config, scope) {
                var selfDt = this;

                if (config) {
                    selfDt.header.init(config.header);
                    selfDt.action.init(config.action);
                } else {
                    nptDatatableStore.datatable($scope.name, function (config) {
                        selfDt.header.init(config.header);
                        selfDt.action.init(config.action);
                    });
                }

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

                        //获取表单配置数据
                        nptFormStore.from(action.target, function (formConfig) {
                            //初始化表单配置
                            self.editForm[formConfig.type].config = formConfig;
                            self.editForm.type = formConfig.type;
                            //清理数据
                            self.editForm.data = {};
                            self.editForm.originData = {};
                            //清理表单状态
                            if (self.editForm[formConfig.type].reset) {
                                self.editForm[formConfig.type].reset();
                            }

                            //拷贝数据
                            angular.copy(item, self.editForm.data);
                            angular.copy(item, self.editForm.originData);

                            if (self.editForm[formConfig.type].open) {
                                self.editForm[formConfig.type].open();
                            }
                        });
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

        this.editForm = {
            data: {},
            options: {},
            fields: [],
            init: function (element) {
                this.modalEle = $(element).find("#editFormFor");
                this.open = function () {
                    this.modalEle.modal("show");
                };

                this.close = function () {
                    this.modalEle.modal('hide');
                };


            },
            onSubmit: function onSubmit() {
                //vm.options.updateInitialValue();
                alert(JSON.stringify(this.data), null, 2);
            }
        };
        $scope.editForm = this.editForm;

    }])
    .
    directive("nptDatatable", ['$parse', function ($parse) {
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
                ctrl.$datatable.init(scope.options, scope);
                ctrl.editForm.init(element);

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