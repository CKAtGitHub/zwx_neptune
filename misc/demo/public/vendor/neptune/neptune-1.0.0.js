angular.module("ui.neptune", [
    'ui.neptune.tpls',
    "ui.neptune.service",
    "ui.neptune.validator",
    "ui.neptune.filter",
    "ui.neptune.directive"
]);

angular.module("ui.neptune.service", [
    "ui.neptune.service.resource",
    "ui.neptune.service.model"
]);
angular.module("ui.neptune.validator", ['ui.neptune.validator.number2date']);
angular.module("ui.neptune.filter", []);

angular.module("ui.neptune.directive", [
    "ui.neptune.directive.datatable",
    "ui.neptune.directive.selectTree",
    "ui.neptune.directive.form"
]);
;/**
 * Created by leon on 15/11/6.
 */

angular.module("ui.neptune.service.model", [])
    .provider("ModelConfig", function () {
        this.models = {};

        /**
         * 注册一个模型,可以链式调用
         * @param name
         * @param model
         * @returns {*}
         */
        this.model = function (name, model) {
            if (!model) {
                model = name;
                name = model.name;
            }

            if (!name) {
                throw new Error("module must have a name.");
            }
            this.models[name] = model;
            return this;
        };

        this.$get = function () {
            var self = this;
            var service = {
                /**
                 * 根据名称获取模型.
                 * @param name
                 * @param done
                 */
                model: function (name, done) {
                    if (name && done) {
                        done(self.models[name]);
                    }
                }
            };
            return service;
        };
    });;/**
 * Created by leon on 15/11/3.
 */

angular.module("ui.neptune.service.resource", [])
    .provider("nptResource", function () {

        this.params = {};
        this.header = {};
        this.backendUrl = "/service";
        this.cache = {};
        this.originData = {};

        this.setBackendUrl = function (backendUrl) {
            this.backendUrl = backendUrl;
        };

        this.$get = function ($http) {

            var self = this;

            var service = {
                //调用资源
                post: function (name, params, success, error) {
                    params = params || {};
                    //加入固定查询参数
                    angular.extend(params, self.params);

                    $http.post(self.backendUrl, {
                        "y9action": {
                            name: name,
                            params: params
                        }
                    }).success(function (data) {
                        //记录原始数据
                        self.originData = data;
                        if (data.code === "100") {
                            //记录cache
                            if (data.cache) {
                                for (var key in data.cache) {
                                    var oldCache = self.cache[key] || {};
                                    self.cache[key] = angular.extend(oldCache, data.cache[key]);
                                }
                            }

                            //回调成功
                            if (success) {
                                success(data.data);
                            }
                        } else {
                            if (error) {
                                error(data);
                            }
                        }
                    }).error(function (data) {
                        self.originData = data;
                        if (error) {
                            error(data);
                        }
                    });
                },
                cache: function (key, id) {
                    //如果未指定任何需要查询的cache key以及id则返回全部cache
                    if (!key && !id) {
                        return self.cache;
                    }

                    //如果指定了key但是没有指定id则返回这个类型的cache
                    if (key && !id) {
                        return self.cache[key];
                    }

                    if (key && id && self.cache[key]) {
                        return self.cache[key][id];
                    }
                },
                originData: function () {
                    return self.originData;
                }
            };

            return service;
        };
    })
;;/**
 * Created by leon on 15/11/5.
 */
angular.module("ui.neptune.validator.number2date", [])
    .directive("nptNumber2date", function () {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, ctrl) {
                var validateFn = function (value) {
                    var valid = false;
                    var stringValue = value + "";
                    if (value && stringValue.length === 8) {
                        var newValue = stringValue.substring(0, 4) + "/" + stringValue.substring(4, 6) + "/" + stringValue.substring(6, 8);
                        var date = new Date(newValue);
                        if (isNaN(date)) {
                            //不是日期格式
                            valid = false;
                        } else {
                            //日期格式正确
                            valid = true;
                        }
                    }
                    ctrl.$setValidity("nptNumber2date", valid);
                    return value;
                };

                ctrl.$parsers.push(validateFn);
                ctrl.$formatters.push(validateFn);

                //scope.$watch(attrs.number2date, function () {
                //    ctrl.$setViewValue(ctrl.$viewValue);
                //});
            }
        };
    });;/**
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
    }]);;/**
 * Created by leon on 15/10/29.
 */

angular.module("ui.neptune.directive.form", [])
    .controller("FormControllect", ["$scope", function ($scope) {

        this.init = function () {

        };

        $scope.doAction = function (item) {
            if (angular.isDefined($scope.onClickAction)) {
                $scope.onClickAction({
                    item: item
                });
            }
        };

        $scope.doSave = function () {
            console.info("保存表单");
        };

        $scope.doReset = function () {
            console.info("重置表单");
        };

    }])
    .directive("nptForm", ["ModelConfig", function (modelConfig) {
        return {
            restrict: "E",
            controller: "FormControllect",
            replace: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/form/form.html";
            },
            scope: {
                model: "=?",
                data: "=",
                onClickAction: "&",
                onSave: "&",
                onReset: "&"
            },
            compile: function (element) {
                //初始化界面html
                return {
                    pre: function (scope, element, attrs, ctrls) {

                        if (attrs.name && !scope.model) {
                            modelConfig.model(attrs.name, function (model) {
                                scope.model = model;
                            });
                        }
                    },
                    post: function (scope, element, attrs, ctrls) {
                        var demo = element;
                    }
                };
            }
        };
    }]);;/**
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
;angular.module('ui.neptune.tpls', ['/template/datatable/datatable.html', '/template/form/form.html', '/template/select-tree/select-tree.html']);

angular.module("/template/datatable/datatable.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/template/datatable/datatable.html",
    "<div><div id=\"editFormFor\" name=\"editFormFor\" tabindex=\"-1\" role=\"dialog\" class=\"modal fade\"><div class=\"modal-dialog modal-lg\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" ng-click=\"editForm.close()\" aria-label=\"关闭\" class=\"close\"><span>&times</span></button><h4 class=\"modal-title\">编辑</h4></div><div class=\"modal-body\"><form form-for=\"editForm.data\" controller=\"editFormController\" form-for-builder validation-rules=\"editForm.validationAndViewRules\" submit-with=\"editForm.submit(data)\"><submit-button label=\"确定\" buttonClass=\"btn btn-primary\" icon=\"fa fa-user\"></submit-button><button type=\"button\" ng-click=\"editForm.reset()\" class=\"btn btn-danger\">重置</button></form></div><div class=\"modal-footer\"><button ng-click=\"editForm.close()\" class=\"btn btn-default\">关闭</button></div></div></div></div><div class=\"col-md-12\"><!-- 设置为响应式表格 当页面宽度不够显示表格内容时会出现滚动条--><div class=\"table-responsive\"><!-- table-striped表示隔行显示不同颜色条纹；table-hover鼠标悬停变色；table-bordered表格线框;table-condensed紧缩表格--><table class=\"table table-striped table-bordered table-hover table-condensed\"><tfoot><tr ng-show=\"isPagination\"><td colspan=\"50\"><uib-pagination style=\"margin:0px;\" total-items=\"totalItems\" ng-model=\"currPage\" items-per-page=\"itemsPerPage\" max-size=\"maxSize\" boundary-links=\"true\" first-text=\"首页\" previous-text=\"上一页\" next-text=\"下一页\" last-text=\"尾页\" class=\"pagination-sm\"></uib-pagination></td></tr></tfoot><thead><tr ng-show=\"isPagination\"><td colspan=\"50\"><uib-pagination style=\"margin:0px;\" total-items=\"totalItems\" ng-model=\"currPage\" items-per-page=\"itemsPerPage\" max-size=\"maxSize\" boundary-links=\"true\" first-text=\"首页\" previous-text=\"上一页\" next-text=\"下一页\" last-text=\"尾页\" class=\"pagination-sm\"></uib-pagination></td></tr><tr><th ng-if=\"isIndex\" class=\"text-center\">&#24207;&#21495;</th><th ng-repeat=\"item in header.items\" class=\"text-center\">{{item.label}}</th><th ng-if=\"action.items.length&gt;0\" class=\"text-center\">&#25805;&#20316;</th></tr></thead><tbody><tr ng-repeat=\"item in pageData\"><td ng-if=\"isIndex\" class=\"text-center\">{{($index+1)+(currPage * itemsPerPage - itemsPerPage)}}</td><td ng-repeat=\"headerItem in header.items\">{{item[headerItem.name]}}</td><td ng-if=\"action.items.length&gt;0\"><a ng-repeat=\"actionItem in action.items\" href=\"\" ng-click=\"action.onClick(actionItem,item,currPage * itemsPerPage - itemsPerPage + $parent.$index)\" class=\"btn btn-primary btn-xs\">{{actionItem.label}}</a></td></tr></tbody></table></div></div></div>");
}]);

angular.module("/template/form/form.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/template/form/form.html",
    "<div></div>");
}]);

angular.module("/template/select-tree/select-tree.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/template/select-tree/select-tree.html",
    "<div><div id=\"treeSelect\" tabindex=\"-1\" role=\"dialog\" class=\"modal fade\"><div class=\"modal-dialog modal-lg\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" ng-click=\"close()\" aria-label=\"关闭\" class=\"close\"><span>&times</span></button><h4 class=\"modal-title\">选择用户</h4></div><div class=\"modal-body\"><div class=\"row\"><div class=\"col-md-4\"><div ui-tree id=\"tree-root\" data-drag-enabled=\"false\"><ol ui-tree-nodes ng-model=\"treeData\"><li ng-repeat=\"node in treeData\" ui-tree-node ng-include=\"'org_nodes.html'\"></li></ol></div></div><div class=\"col-md-8\"><npt-datatable name=\"listSelect\" is-pagination=\"true\" items-per-page=\"5\" header=\"listHeader\" action=\"listAction\" data=\"listData\" is-index=\"true\" on-action=\"onListSelect(type,item,index)\"></npt-datatable></div></div></div><div class=\"modal-footer\"><button ng-click=\"close()\" class=\"btn btn-default\">关闭</button></div></div></div></div><script type=\"text/ng-template\" id=\"org_nodes.html\"><div ui-tree-handle class=\"tree-node tree-node-content\"><a ng-if=\"node.nodes &amp;&amp; node.nodes.length &gt; 0\" ng-click=\"toggle(this)\" class=\"btn btn-success btn-xs\"><span ng-class=\"{'glyphicon-chevron-right': collapsed,'glyphicon-chevron-down': !collapsed}\" class=\"glyphicon\"></span></a>&nbsp &nbsp<a ng-click=\"onTreeClick(node)\" class=\"btn-link\">{{node.title}}</a></div><ol ui-tree-nodes=\"\" ng-model=\"node.nodes\" ng-class=\"{hidden:collapsed}\"><li ng-repeat=\"node in node.nodes\" ui-tree-node ng-include=\"'org_nodes.html'\"></li></ol></script></div>");
}]);
