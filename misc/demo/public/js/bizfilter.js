/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

'use strict';
angular.module('bizFilterDemo', ["ui.neptune","angular.filter"])
    .controller('bizFilterCtrl', function ($scope) {
        $scope.session = {"userid": "10000001498059", "instid": "10000001463017"};
    })
    .config(function (nptBizFilterProviderProvider) {
        nptBizFilterProviderProvider.addConfig('orderFilter', {
            "bizName": "queryOrderList",
            "bizParams": {"instid": "session.instid"},
            "chains":["limitTo: 5"]
        });
        nptBizFilterProviderProvider.addConfig('orderFilterSnToName', {
            "bizName": "queryOrderList",
            "bizParams": {"instid": "session.instid","userid": "session.userid"},
            "chains":['limitTo: 5','pick:"ordersn=="+$value','pickup:"name"']
        });
    });