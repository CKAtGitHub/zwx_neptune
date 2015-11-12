/**
 * Created by leon on 15/11/12.
 */

angular.module("ui.neptune.service.repository", [])
    .provider("nptRepository", function () {
        this.baseURL = "/service";
        this.actionKey = "y9action";
        this._interceptors = [processParams];

        //重新组织参数结构
        function processParams(response) {
            return {
                originResponse: response,
                data: response.data.data,
                cache: response.data.cache,
                cause: response.data.cause,
                code: response.data.code,
                throwable: response.data.throwable
            };
        }

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

        this.$get = function ($http, $q, nptCache) {
            var self = this;
            //资源对象
            function Repository() {
                this._params = {};
                this._lastParams = undefined;
                this._header = {};
                this._baseURL = self.baseURL;
                this._action = undefined;
                this._interceptors = [];
            }

            Repository.prototype.params = function (key, value) {
                putKeyValue(key, value, this._params);
                return this;
            };

            Repository.prototype.header = function (key, value) {
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
                return post(runParams, this);
            };

            Repository.prototype.refresh = function () {
                if (this._lastParams) {
                    return post(this._lastParams, this);
                }
            };

            function post(params, scope) {
                var postData = {};
                postData[self.actionKey] = {
                    name: scope._action,
                    params: params
                };

                var result = $http.post(scope._baseURL, postData).then(function (response) {
                    //处理逻辑code
                    if (response.data.code === "100") {
                        return response;
                    } else {
                        return $q.reject(response.data.cause);
                    }
                }, function (error) {
                    return "服务器错误!";
                });

                //将全局拦截器插入
                angular.forEach(self._interceptors, function (value) {
                    result = result.then(value);
                });

                //记录Cache
                result = result.then(function (response) {
                    nptCache.useByResponse(response);
                    return response;
                });

                //将实例拦截器插入
                angular.forEach((scope._interceptors), function (value) {
                    result = result.then(value);
                });

                return result;
            }

            function putKeyValue(key, value, target) {
                if (!key) {
                    return;
                }

                if (!value) {
                    if (angular.isArray(key)) {
                        angular.forEach(key, function (value) {
                            angular.extend(target, value);
                        });
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

                return repository;
            }

            return repositoryFactory;
        };
    })
;