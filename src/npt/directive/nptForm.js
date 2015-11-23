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

            function formStoreFactory(name, setting) {
                return new FormStore(name, setting);
            }

            return formStoreFactory;
        };

    })
    .controller("FormControllect", function ($scope) {
        var vm = this;

        //记录表单数据模型
        vm.model = $scope.model;

        vm.formController = {};

        vm.onSubmit = onSubmit;

        //表单API
        vm.nptFormApi = {
            model: vm.model,
            buttons: {},
            loadStore: function (store) {
                this.store = store;
                vm.options = angular.copy(store.getOptions()) || {};
                vm.fields = angular.copy(store.getFields()) || {};

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

                vm.originalFields = angular.copy(vm.fields);

            },
            disabled: function (state) {
                vm.options.formState.disabled = state;
            }
        };

        //初始化配置信息
        if ($scope.nptForm) {
            if ($scope.nptForm.store) {
                vm.nptFormApi.store = $scope.nptForm.store;
                vm.nptFormApi.loadStore($scope.nptForm.store);
            }
            if ($scope.nptForm.onRegisterApi) {
                $scope.nptForm.onRegisterApi(vm.nptFormApi);
            }

            //设置按钮显示
            $scope.nptForm.buttons = $scope.nptForm.buttons || {};
            vm.nptFormApi.buttons.ok = $scope.nptForm.buttons.ok === undefined ? true : $scope.nptForm.buttons.ok;
            vm.nptFormApi.buttons.reset = $scope.nptForm.buttons.reset === undefined ? true : $scope.nptForm.buttons.reset;

            vm.nptFormApi.options = $scope.nptForm;
        }

        function onSubmit() {
            if (vm.nptFormApi.options.onSubmit) {
                vm.nptFormApi.options.onSubmit();
            }
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