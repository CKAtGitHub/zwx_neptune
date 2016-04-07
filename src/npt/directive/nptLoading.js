/*!
 * mars
 * Copyright(c) 2016 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.directive.nptLoading", ['ui.neptune.service.messageBox'])
    .controller("NptLoadingController",function($scope) {

    })
    .directive("nptLoading", function ($compile,nptMessageBox) {
        return {
            restrict: "A",
            replace: false, //使用template的内容完全替换y9ui-datatable(自定义指令标签在编译后的html中将会不存在)
            controller: "NptLoadingController",
            template:"",
            link : function(scope, element, attrs) {
                var modal;
                function openMask(message) {
                    message = message || "正在加载...";
                    modal = nptMessageBox
                        .open({
                            title: message,
                            modal: {
                                backdrop: 'static',
                                templateUrl:"/template/message-box/show-loading.html",
                                size:"ssm",
                                openedClass:"background-color: transparent;"
                            }
                        });
                    middBox();
                }

                function middBox() {
                    var screenWidth = window.document.documentElement.clientWidth;
                    var screenHeight = window.document.documentElement.clientHeight;
                    var box = window.document.getElementById('loadingmessagebox');
                    box.style.marginTop = (screenHeight - box.offsetHeight) / 2;
                    box.style.marginLeft = (screenWidth - box.offsetWidth) / 2;
                }

                function closeMask() {
                    if (modal) {
                        modal.uibModal().dismiss();
                        modal = undefined;
                    }
                }
                scope.$watchCollection(attrs.nptLoading,function(options){
                    if (angular.isUndefined(options)) {
                        return;
                    }
                    if (angular.isObject(options)) {
                        if (options.showMask) {
                            openMask(options.message);
                        } else {
                            closeMask();
                        }
                        if (options.onRegisterApi) {
                            options.onRegisterApi({
                                openMask:openMask,
                                closeMask:closeMask

                            });
                        }
                    } else if (typeof options == "boolean") {
                        if (options) {
                            openMask();
                        } else {
                            closeMask();
                        }
                    }
                });
            }
        };
    });