/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module('ui.neptune.filter.commonFilter', [])
.filter('timestampFilter', function ($filter) {
        /**过滤时间戳到指定格式显示*/
        return function (input, formate) {
            if (!input || !angular.isNumber(input)) {
                return input;
            }
            var dateFilter = $filter('date');
            formate = formate || "yyyy-MM-dd hh:mm:ss";
            var dateString = dateFilter(input,formate);
            return dateString || undefined;
        };
}).filter('yesOrNo', function () {
        return function (input, yes,no) {
            if (input) {
                return yes || "是";
            }
            return no || "否";
        };
    });