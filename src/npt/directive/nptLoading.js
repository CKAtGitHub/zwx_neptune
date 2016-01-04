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
                // maskID
                scope.maskId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                }).replace(/-/g,"");
                scope.loadingMessage = "正在加载...";
                var div = $compile('<div ng-show="showLoadingMask" id="'+scope.maskId+'" style="position: absolute; top: 0px; filter: alpha(opacity=60); ' +
                    'background-color: #777;z-index: 9999; left: 0px;opacity:0.4; -moz-opacity:0.4;">' +
                    '<div style="text-align: center;color: white;font-weight: 700;font-size: 15px;"><img src="/image/loading.gif" />{{loadingMessage}}</div>' +
                    '</div>')(scope);
                // 暂时不去搞指定区域的mask
                div.css("height",$(document).height());
                div.css("width",$(document).width());
                element.prepend(div);

                scope.$watchCollection(attrs.nptLoading,function(options){
                    if (angular.isUndefined(options)) {
                        return;
                    }
                    if (angular.isObject(options)) {
                        if (options.message) {
                            scope.loadingMessage = options.message;
                        }
                        scope.showLoadingMask = options.showMask;
                    } else if (typeof options == "boolean") {
                        scope.showLoadingMask = options;
                    }
                });
            }
        };
    });