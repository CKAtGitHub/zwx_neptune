/**
 * Created by leon on 15/11/12.
 */

angular.module("ui.neptune.service.repository", [])
    .provider("Repository", function () {

        this.baseURL = "/service";
        this.actionKey = "y9action";

        this.setBaseURL = function (baseURL) {
            if (baseURL) {
                this.baseURL = baseURL;
            }
        };

        this.setActionKey = function (key) {
            if (key) {
                this.actionKey = key;
            }
        };

        this.$get = function ($http) {
            var self = this;
            //资源对象
            function Repository() {
                this._params = {};
                this._lastParams = undefined;
                this._header = {};
                this._baseURL = self.backendUrl;
                this._action = undefined;
                this._interceptors = [];
            }

            Repository.prototype.params = function (key, value) {
                putKeyValue(key, value, this._params);
                return this;
            };

            Repository.prototype.params = function (key, value) {
                putKeyValue(key, value, this._header);
                return this;
            };

            Repository.prototype.setAction = function (action) {
                this._action = action;
            };

            Repository.prototype.addInterceptor = function (interceptor) {
                if (angular.isFunction(interceptor)) {
                    this._interceptors.push(interceptor);
                }
            };

            Repository.prototype.post = function (params) {
                var runParams = {};
                //自上而下合并查询参数
                angular.extend(runParams, self.params || {});
                angular.extend(runParams, this._params || {});
                angular.extend(runParams, params || {});
                //记录最后一次的查询参数
                this._lastParams = runParams;
                //执行查询
                return post(runParams);
            };

            Repository.prototype.refresh = function () {
                if (this._lastParams) {
                    return post(this._lastParams);
                }
            };

            function post(params) {
                var postData = {};
                postData[self.actionKey] = {
                    name: this._action,
                    params: params
                };

                var result = $http.post(self.backendUrl, postData);
                result.then(success, failed);
                return result;
            }

            function success(data) {
                console.info("调用完成");
            }

            function failed(error) {
                console.info("调用个失败");
            }

            function putKeyValue(key, value, target) {
                if (!key) {
                    return;
                }

                if (!value) {
                    if (angular.isArray(key)) {
                        angular.forEach(key, function (value) {
                            angular.extend(target, value);
                        })
                    } else {
                        angular.extend(target, key);
                    }
                }

                if (key && value) {
                    angular.extend(target, {key: value});
                }
            }

            function repositoryFactory(action) {
                var repository = new Repository();
                repository.setAction(action);
            }

            return repositoryFactory;
        }
    })
;