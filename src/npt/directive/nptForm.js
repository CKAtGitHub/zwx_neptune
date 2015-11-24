/**
 * Created by leon on 15/10/29.
 */

angular.module("ui.neptune.directive.form", [])
    .provider("nptFormlyStore", function () {


        this.$get = function () {

            function FormStore(name, setting) {
                if (!name) {
                    throw new Error("form store must set name.");
                }

                this._name = name;

                if (setting) {
                    this.setting(setting);
                }
            }

            FormStore.prototype.type = "formly";

            FormStore.prototype.setting = function (setting) {
                this._options = setting.options || {};
                this._fields = setting.fields || [];
                this._onSubmitListens = setting.onSubmitListens || [];
                this._actions = setting.actions || [];
                this._buttons = setting.buttons || {
                        ok: true,
                        reset: true
                    };
            };

            FormStore.prototype.field = function (field) {
                if (field) {
                    this._fields.push(field);
                }
            };

            FormStore.prototype.getOptions = function () {
                return this._options;
            };

            FormStore.prototype.getFields = function () {
                return this._fields;
            };

            FormStore.prototype.getActions = function () {
                return this._actions;
            };

            FormStore.prototype.getButtons = function () {
                return this._buttons;
            };

            FormStore.prototype.getOnSubmitListens = function () {
                return this._onSubmitListens;
            };

            function formStoreFactory(name, setting) {
                return new FormStore(name, setting);
            }

            return formStoreFactory;
        };

    })
    .controller("FormControllect", function ($scope, $q, $injector) {
        var vm = this;
        //记录表单数据模型
        vm.model = $scope.model;
        vm.onSubmit = onSubmit;
        vm.onAction = onAction;

        function NptFormApi(nptForm) {
            var self = this;
            this._options = nptForm;
            this._onSubmitListen = [];
            this._config = {};
            this._onActionListen = undefined;

            //初始化表单配置
            if (nptForm.store) {
                this._config.options = angular.copy(nptForm.store.getOptions()) || {};
                this._config.fields = angular.copy(nptForm.store.getFields()) || {};
                this._config.originalFields = angular.copy(nptForm.store.getFields()) || {};
                this._config.buttons = angular.copy(nptForm.store.getButtons()) || {};
                this._config.actions = angular.copy(nptForm.store.getActions()) || {};

                //注册配置中得监听器
                angular.forEach(nptForm.store.getOnSubmitListens(), function (value) {
                    self.addOnSubmitListen(value);
                });
            }
        }

        function nptFormApiFactory(nptForm) {
            return new NptFormApi(nptForm);
        }

        NptFormApi.prototype.disabled = function (state) {
            if (this._config) {
                this._config.options = this._config.options || {};
                this._config.options.formState = this._config.options.formState || {};
                this._config.options.formState.disabled = state;
            }

            return this;
        };

        NptFormApi.prototype.fields = function () {
            if (this._config) {
                return this._config.fields;
            }
        };

        NptFormApi.prototype.options = function () {
            if (this._config) {
                return this._config.options;
            }
        };

        NptFormApi.prototype.buttons = function () {
            if (this._config) {
                return this._config.buttons;
            }
        };

        NptFormApi.prototype.actions = function () {
            if (this._config) {
                return this._config.actions;
            }
        };

        NptFormApi.prototype.setOnActionListen = function (listen) {
            if (listen && angular.isFunction(listen)) {
                this._onActionListen = listen;
            }
            return this;
        };

        NptFormApi.prototype.getOnActionListen = function () {
            return this._onActionListen;
        };

        NptFormApi.prototype.addOnSubmitListen = function (listen) {
            if (listen && angular.isFunction(listen)) {
                this._onSubmitListen.push(listen);
            }
            return this;
        };

        NptFormApi.prototype.getOnSubmitListens = function () {
            return this._onSubmitListen;
        };

        NptFormApi.prototype.promise = function (promise) {
            this._promise = promise;
            return this;
        };

        NptFormApi.prototype.loading = function () {
            if (this._promise && this._promise.$$state.status === 0) {
                return true;
            } else {
                return false;
            }
        };


        vm.init = function (nptForm) {
            //初始化API
            vm.nptFormApi = nptFormApiFactory(nptForm);
            vm.fields = vm.nptFormApi.fields();
            vm.options = vm.nptFormApi.options();
            vm.buttons = vm.nptFormApi.buttons();
            vm.actions = vm.nptFormApi.actions();

            angular.forEach(vm.fields, function (field) {
                field.expressionProperties = field.expressionProperties || {};
                field.expressionProperties['templateOptions.disabled'] = 'formState.disabled';
            });

            $scope.$watch('vm.options.formState', function () {
                angular.forEach(vm.fields, function (field) {
                    if (field.runExpressions) {
                        field.runExpressions();
                    }
                });
            }, true);

            //注册api回调
            if (nptForm.onRegisterApi) {
                nptForm.onRegisterApi(vm.nptFormApi);
            }
        };

        //初始化配置信息
        if ($scope.nptForm) {
            vm.init($scope.nptForm);
        }

        function onAction(action) {
            if (vm.nptFormApi.getOnActionListen()) {
                $injector.invoke(vm.nptFormApi.getOnActionListen(), this, {
                    model: vm.model,
                    action: action
                });
            }
        }

        function onSubmit() {
            var promises = [];

            angular.forEach(vm.nptFormApi.getOnSubmitListens(), function (listen) {
                promises.push($q.when($injector.invoke(listen, this, {
                    model: vm.model
                })));
            });

            var promise = $q.all(promises).then(function (response) {
                return response;
            }, function (error) {
                return error;
            });
            vm.nptFormApi.promise(promise);
        }
    })
    .directive("nptForm", [function () {
        return {
            restrict: "EA",
            controller: "FormControllect as vm",
            replace: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/form/form.html";
            },
            scope: {
                nptForm: "=",
                model: "="
            },
            link: function () {
            }
        };
    }]);