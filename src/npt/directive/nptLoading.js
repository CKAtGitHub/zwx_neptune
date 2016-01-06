/*!
 * mars
 * Copyright(c) 2016 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.directive.nptLoading", [])
    .controller("NptLoadingController",function($scope) {

    })
    .directive("nptLoading", function ($compile) {
        return {
            restrict: "A",
            replace: false, //使用template的内容完全替换y9ui-datatable(自定义指令标签在编译后的html中将会不存在)
            controller: "NptLoadingController",
            template:"",
            link : function(scope, element, attrs) {
                element.css("position","relative");
                element.css("z-index","99");
                scope.loadingMessage = "正在加载...";
                var div = $compile('<div ng-show="showLoadingMask" style="position: absolute; top: 0px; filter: alpha(opacity=60); ' +
                    'background-color: #eee;z-index: 9999; left: 0px;opacity:0.8; -moz-opacity:0.8;">' +
                    '<div style="text-align: center;color: black;font-weight: 700;font-size: 16px;"><img src="/image/loading.gif" />{{loadingMessage}}</div>' +
                    '</div>')(scope);
                element.prepend(div);

                div.css("height",element.height());
                div.css("width",element.width());

                var callback = function(records) {
                    records.map(function(record) {
                        var target = $(record.target);
                        div.css("height",target.height());
                        div.css("width",target.width());
                    });
                };
                var MutationObserver = window.MutationObserver ||
                    window.WebKitMutationObserver ||
                    window.MozMutationObserver;
                var obser = new MutationObserver(callback);
                var ob_options = {
                    attributes: true,
                    childList: true,
                    attributeFilter: ['style']
                };

                // 全屏跟部分遮挡，布局要求不一样
                function fullScreen(isFs) {
                    if (isFs) {
                        obser.disconnect();//如果是全屏，则没必要监听div宽高改变了，停止监听
                        element.css("position","");
                        element.css("z-index","");
                        div.css("height",$(document).height());
                        div.css("width",$(document).width());
                    } else {
                        element.css("position","relative");
                        element.css("z-index","99");
                    }
                }

                obser.observe(element[0], ob_options);//开始监听
                scope.$watchCollection(attrs.nptLoading,function(options){
                    if (angular.isUndefined(options)) {
                        return;
                    }
                    if (angular.isObject(options)) {
                        if (options.message) {
                            scope.loadingMessage = options.message;
                        }
                        scope.showLoadingMask = options.showMask;
                        if (scope.showLoadingMask) {
                            fullScreen(options.fullScreen);
                        }
                    } else if (typeof options == "boolean") {
                        scope.showLoadingMask = options;
                    }
                });
            }
        };
    });