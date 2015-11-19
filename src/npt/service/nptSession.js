/**
 * Created by leon on 15/11/13.
 */

angular.module("ui.neptune.service.session", [])
    .provider("nptSession", function () {
        this._baseURL = "/api/session";
        this._userProp = "user";

        this.setBaseURL = function (baseURL) {
            if (baseURL) {
                this._baseURL = baseURL;
            }
        };

        this.setUserProp = function (userProp) {
            if (userProp) {
                this._userProp = userProp;
            }
        };

        this.$get = function ($http, nptSessionManager) {
            var self = this;

            function Session() {
                this._response = undefined;
                this._user = undefined;
            }

            Session.prototype.getUser = function () {
                return this._user;
            };

            Session.prototype.getResponse = function () {
                return this._response;
            };

            function sessionFactory() {
                return $http.get(self._baseURL).then(function (response) {
                    //响应转换为Session
                    var session = new Session();
                    session._response = response;
                    session._user = response.data[self._userProp];
                    nptSessionManager.setSession(session);
                    return session;
                });
            }

            return sessionFactory;
        };
    })
    .factory("nptSessionManager", function () {
        var self = this;
        return {
            setSession: function (session) {
                if (session) {
                    self._session = session;
                }
            },
            getSession: function () {
                return self._session;
            }
        };
    });