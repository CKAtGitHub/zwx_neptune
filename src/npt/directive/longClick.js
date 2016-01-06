/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.directive.longClick", [])
    .directive("longClick", function ($timeout) {
        return {
            restrict: "A",
            replace: false,
            template: "",
            scope: {
                longClick: "&"
            },
            link : function(scope, element, attrs) {
                var timer;
                var isLongClick;
                element.click(function(event) {
                    if (isLongClick) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                });
                element.mouseup(function(event) {
                    $timeout.cancel( timer );
                });
                element.mousedown(function(event) {
                    isLongClick = false;
                    timer = $timeout(function() {
                        isLongClick = true;
                        scope.longClick({event:event});
                        $timeout.cancel( timer );
                    },500);
                });
            }
        };
    });