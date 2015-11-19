/**
 * Created by leon on 15/11/13.
 */

angular.module("sessionDemo", ["ui.neptune", "ngRoute"])
    .config(function ($routeProvider) {
        $routeProvider.when("/list", {
            controller: "SessionDemoController as vm",
            templateUrl: "session-demo.html",
            resolve: {
                sessionData: function (nptSession) {
                    return nptSession();
                }
            }
        }).otherwise({
            redirectTo: "/list"
        });

    })
    .factory("DemoFactory", function (nptSessionManager) {
        var session = nptSessionManager.getSession();
        return {};
    })
    .controller("SessionDemoController", function ($scope, sessionData, DemoFactory) {
        var vm = this;
        vm.session = {
            user: sessionData.getUser(),
            response: sessionData.getResponse()
        };
    });