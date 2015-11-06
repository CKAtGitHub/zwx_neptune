/**
 * Created by leon on 15/10/28.
 */

angular.module("ui.neptune.directive.datatable", ['ui.bootstrap', "formFor", "formFor.bootstrapTemplates"])
    .provider("DatatableStore", function () {
        this.storeConfig = {};

        this.config = {
            currPage: 1,
            maxSize: 10,
            itemsPerPage: 5,
            isIndex: false,
            isPagination: false
        };

        this.store = function (name, module) {

            if (!module) {
                module = name;
                name = module.name;
            }

            if (!name) {
                throw new Error("must have name.");
            }

            this.storeConfig[name] = module;

            return this;
        };

        this.$get = function () {
            var self = this;
            var service = {
                getStore: function (name, done) {
                    if (done) {
                        done(self.storeConfig[name]);
                    }
                },
                getConfig: function () {
                    return self.config;
                }
            };
            return service;
        };
    })
    .controller("datatableController", ["$scope", "$attrs", "DatatableStore", function ($scope, $attrs, DatatableStore) {
        var self = this;
        $scope.editFormController = {};

        //初始化参数
        this.config = DatatableStore.getConfig();
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
                if (action.type === "editForm") {
                    //清理数据
                    $scope.editForm.data = {};
                    $scope.editForm.originData = {};
                    //清理表单状态
                    $scope.editFormController.resetErrors();

                    //拷贝数据
                    angular.copy(item, $scope.editForm.data);
                    angular.copy(item, $scope.editForm.originData);
                    $scope.editForm.open();
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

        $scope.editForm = {
            data: {},
            originData: {},
            submit: function (data) {
                console.info(JSON.stringify(data));
            },
            reset: function () {
                angular.copy($scope.editForm.originData, $scope.editForm.data);
                $scope.editFormController.resetErrors();
            }
        };

        this.initAction = function (actionConfig) {
            if (actionConfig) {
                for (var key in actionConfig) {
                    var action = {
                        name: key,
                        label: actionConfig[key].label,
                        type: actionConfig[key].type || "none"
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

        this.initEditForm = function (editFormConfig) {
            if (editFormConfig) {
                $scope.editForm.validationAndViewRules = editFormConfig.validationAndViewRules || {};
            }
        };

        if ($scope.options) {
            this.initHeader(options.header);
            this.initAction(options.action);
            this.initEditForm(options.editForm);
        } else {
            DatatableStore.getStore($scope.name, function (storeConfig) {
                self.initHeader(storeConfig.header);
                self.initAction(storeConfig.action);
                self.initEditForm(storeConfig.editForm);
            });
        }

        this.$init = function (element) {
            $scope.editForm.modalEle = $(element).find("#editFormFor");
            $scope.editForm.open = function () {
                $scope.editForm.modalEle.modal("show");
            };

            $scope.editForm.close = function () {
                $scope.editForm.modalEle.modal('hide');
            };
        };

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
                ctrl.$init(element);

                scope.editFormController.registerSubmitButton();
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