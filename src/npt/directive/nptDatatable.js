/**
 * Created by leon on 15/10/28.
 */

angular.module("ui.neptune.directive.datatable", ['ui.bootstrap', "formFor", "formFor.bootstrapTemplates"])
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


        //初始化参数
        this.config = datatableConfig();

        $scope.currPage = $scope.currPage || this.config.currPage;
        $scope.totalItems = 0;
        if ($scope.data) {
            $scope.totalItems = $scope.data.length || 0;
        }

        $scope.maxSize = this.config.maxSize;
        $scope.itemsPerPage = $scope.itemsPerPage || this.config.itemsPerPage;
        $scope.pageData = [];
        $scope.isIndex = $scope.isIndex || config.isIndex;
        $scope.isPagination = $scope.isPagination || this.config.isPagination;

        $scope.action = {
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
        };

        $scope.header = {
            items: []
        };

        this.editForm = {
            data: {},
            type: "none",
            originData: {},
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
                alert(JSON.stringify(vm.model), null, 2);
            },

            formFor: {
                editFormController: {},
                submit: function (data) {
                    console.info(JSON.stringify(data));
                },
                reset: function () {
                    angular.copy(self.editForm.originData, self.editForm.data);
                    //this.editFormController.resetErrors();
                },
                init: function (element) {

                }
            },
            formly: {
                init: function (element) {

                }
            }
        };
        $scope.editForm = this.editForm;

        this.initAction = function (actionConfig) {
            if (actionConfig) {
                for (var key in actionConfig) {
                    var action = {
                        name: key,
                        label: actionConfig[key].label,
                        type: actionConfig[key].type || "none",
                        target: actionConfig[key].target || undefined
                    };
                    $scope.action.items.push(action);
                }
            }
        };

        this.initHeader = function (headerConfig) {
            if (headerConfig) {
                for (var key in headerConfig) {
                    $scope.header.items.push({
                        name: key,
                        label: headerConfig[key].label
                    });
                }
            }
        };

        if ($scope.options) {
            this.initHeader(options.header);
            this.initAction(options.action);
        } else {
            nptDatatableStore.datatable($scope.name, function (storeConfig) {
                self.initHeader(storeConfig.header);
                self.initAction(storeConfig.action);
            });
        }

        this.$pageChange = function () {
            //初始化分页数据
            $scope.pageData = [];
            var endIndex = 0;
            var beginIndex = 0;

            if ($scope.isPagination) {
                endIndex = $scope.currPage * $scope.itemsPerPage;
                beginIndex = $scope.currPage * $scope.itemsPerPage - $scope.itemsPerPage;
            } else {
                beginIndex = 0;
                endIndex = 0;
                if ($scope.data) {
                    endIndex = $scope.data.length;
                }
            }

            if ($scope.data) {
                for (beginIndex; beginIndex < endIndex; beginIndex++) {
                    if (beginIndex >= $scope.data.length) {
                        break;
                    } else {
                        $scope.pageData.push($scope.data[beginIndex]);
                    }
                }
            }
        };
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
                ctrl.editForm.init(element);
                //监控数据集合是否发生改变
                scope.$watchCollection("data", function (newValue, oldValue) {
                    //如果存在数据则出发第一页
                    if (angular.isDefined(newValue) && newValue !== null) {
                        //刷新总行数
                        scope.totalItems = newValue.length;
                        ctrl.$pageChange();
                    }
                });

                scope.$watch("currPage", function (newValue, oldValue) {
                    ctrl.$pageChange();
                });

                if (attrs.name && scope.$parent) {
                    var setter = $parse(attrs.name).assign;
                    setter(scope.$parent, ctrl);
                }
            }
        };
    }]);