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
.factory("messageBoxFactory", function ($uibModal) {
        var factory = {};

        function Modal(options, modalResult) {
            this.options = options;
            this.modalResult = modalResult;

            // 注册弹出框弹出后点击事件
            this.modalResult.then(function (actionCode, scope) {
                console.log("点击.." + actionCode + ";" + scope);
            }, function () {
                console.log("点击了取消..");
            });
        }

        Modal.prototype.then = function () {
            if (arguments.length === 0) {
                return;
            }
        };

        factory.open = function (options) {
            var result = $uibModal.open({
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
            }).result;
            var modal = new Modal(options, result);
            return modal;
        };

        return factory;
    })
    .controller("messageBoxController",
    function ($scope, $uibModalInstance, $compile, $templateCache, modalOptions) {
        var vm = this;

        vm.modalOptions = angular.copy(modalOptions);
        $scope.$$ms = {};
        angular.extend($scope.$$ms, vm.modalOptions.scope || {});

        vm.modalContent = vm.modalOptions.content;
        if (vm.modalOptions.templateUrl) {
            vm.modalContent = $templateCache.get(vm.modalOptions.templateUrl);
        }

        // function assignment
        vm.btnClick = btnClick;
        vm.cancel = cancel;
        // function definition
        function btnClick(type) {
            $uibModalInstance.close({
                type: type,
                scope: $scope.$$ms
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    });
