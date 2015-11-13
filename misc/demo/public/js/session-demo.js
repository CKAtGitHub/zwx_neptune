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
    .controller("SessionDemoController", function ($scope, sessionData) {
        var vm = this;
        vm.session = {
            user: sessionData.getUser(),
            response: sessionData.getResponse()
        };
    });