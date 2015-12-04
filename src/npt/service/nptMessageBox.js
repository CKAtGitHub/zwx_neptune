/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.service.messageBox", ['ui.bootstrap'], function ($compileProvider) {
    $compileProvider.directive('nptCompile', function ($compile) {
        return function (scope, element, attrs) {
            scope.$watch(
                function (scope) {
                    return scope.$eval(attrs.nptCompile);
                },
                function (value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                }
            );
        };
    });
})
    .factory("nptMessageBox", function ($uibModal) {
        var factory = {};

        function Modal(options, uibModal) {
            var self = this;
            this._options = options;
            this._uibModal = uibModal;

            this.action = {};
            angular.forEach(this._options.action, function (action, key) {
                self.action[key] = function () {
                    self._uibModal.close({
                        type: key
                    });
                };
            });
        }

        Modal.prototype.uibModal = function () {
            return this._uibModal;
        };

        Modal.prototype.updateScope = function(name,data) {
            if (arguments.length == 1) {
                this._options.scope = name;
            } else if (arguments.length > 1) {
                this._options.scope[name] = data;
            }
        };

        Modal.prototype.on = function (actionName, fn) {
            if (!actionName || !fn) {
                throw new Error("无效的入参：" + actionName + "," + fn);
            }
            this._options.action[actionName] = this._options.action[actionName] || {};
            this._options.action[actionName].listens = this._options.action[actionName].listens || [];
            this._options.action[actionName].listens.push(fn);

        };


        factory.open = function (options) {
            var defaultOptions = {
                showCancel: false
            };
            options = angular.copy(options);
            options = angular.extend(defaultOptions, options);
            options.action = options.action || {};
            options.scope = options.scope || {};
            var openOptions = {
                animation: true,
                templateUrl: '/template/message-box/message-box.html',
                controller: 'messageBoxController',
                controllerAs: 'vm',
                resolve: {
                    modalOptions: function ($q) {
                        var deferd = $q.defer();
                        deferd.resolve(options);
                        return deferd.promise;
                    }
                }
            };
            openOptions = angular.extend(openOptions, options.modal || {});
            var uibModal = $uibModal.open(openOptions);
            var modal = new Modal(options, uibModal);
            uibModal.opened.then(function () {
                if (options.onRegisterApi) {
                    options.onRegisterApi(modal);
                }
            });
            return modal;
        };

        return factory;
    })
    .controller("messageBoxController",
    function ($scope, $uibModalInstance, $q, $injector, $templateCache, modalOptions) {
        var vm = this;

        vm.modalOptions = modalOptions;
        $scope.$$ms = vm.modalOptions.scope;

        vm.modalContent = vm.modalOptions.content;
        if (vm.modalOptions.templateUrl) {
            vm.modalContent = $templateCache.get(vm.modalOptions.templateUrl);
        }

        // function assignment
        vm.btnClick = function (type) {
            $uibModalInstance.close({
                type: type
            });
        };

        // 执行指定按钮类型的监听器
        function fireListener(type) {
            var modalResult = {
                type: type,
                "scope": $scope.$$ms
            };
            var deferd = $q.defer();
            var promise = deferd.promise;
            deferd.resolve(modalResult);
            var promisesArr = [promise];
            vm.modalOptions.action[type] = vm.modalOptions.action[type] || {};
            var listens = vm.modalOptions.action[type].listens || [];
            //配置中的listen
            angular.forEach(listens, function (listen) {
                promisesArr.push($q.when($injector.invoke(listen, this, {
                    "modalResult": modalResult
                })));
            });
            return $q.all(promisesArr);
        }

        // 监听窗口关闭事件
        $scope.$on("modal.closing", function (event, result) {
            // result 为true时为dismiss事件，不处理
            if (result !== true) {
                event.preventDefault(); // 阻止窗口关闭
                var actionType = "cancel";
                if (angular.isObject(result)) {
                    actionType = result.type;
                }
                fireListener(actionType).then(function () {
                    $uibModalInstance.dismiss(true);
                });
            }

        });
    });
