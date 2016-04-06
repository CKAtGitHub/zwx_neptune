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
                this._responseInterceptors = [];
                this._requestInterceptors = [];
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
                return this;
            };

            Repository.prototype.addResponseInterceptor = function (interceptor) {
                if (angular.isFunction(interceptor)) {
                    this._responseInterceptors.push(interceptor);
                }
                return this;
            };

            Repository.prototype.addRequestInterceptor = function (interceptor) {
                if (angular.isFunction(interceptor)) {
                    this._requestInterceptors.push(interceptor);
                }
                return this;
            };

            Repository.prototype.getData = function () {
                return this.data;
            };

            Repository.prototype.next = function (currData) {
                if (this.data && currData && angular.isArray(this.data)) {
                    var id = currData.id;

                    if (id && this.data.length > 0) {
                        for (var i = 0; i < this.data.length; i++) {
                            if (id === this.data[i].id && i + 1 < this.data.length) {
                                return this.data[i + 1];
                            }
                        }
                    }
                }
            };

            Repository.prototype.hasNext = function (currData) {
                var next = this.next(currData);
                if (next) {
                    return true;
                } else {
                    return false;
                }
            };

            Repository.prototype.previous = function (currData) {
                if (this.data && currData && angular.isArray(this.data)) {
                    var id = currData.id;

                    if (id && this.data.length > 0) {
                        for (var i = 0; i < this.data.length; i++) {
                            if (id === this.data[i].id && i - 1 >= 0) {
                                return this.data[i - 1];
                            }
                        }
                    }
                }
            };

            Repository.prototype.hasPrevious = function (currData) {
                var previous = this.next(currData);
                if (previous) {
                    return true;
                } else {
                    return false;
                }
            };

            Repository.prototype.loading = function () {
                if (this.result && this.result.$$state.status === 0) {
                    return true;
                } else {
                    return false;
                }
            };

            Repository.prototype.post = function (params) {
                var runParams = {};
                var selfRepository = this;
                //自上而下合并查询参数
                angular.extend(runParams, self.params || {});
                angular.extend(runParams, this._params || {});
                angular.extend(runParams, params || {});

                var request = {
                    params: runParams || {},
                    header:selfRepository._header
                };

                //pre拦截器
                var deferd = $q.defer();
                var promise = deferd.promise;
                deferd.resolve(request);

                //写入实例请求拦截器
                if (this._requestInterceptors) {
                    angular.forEach(this._requestInterceptors, function (value) {
                        promise = promise.then(value);
                    });
                }

                return promise.then(function (request) {
                    //记录最后一次的查询参数
                    this._lastParams = request.params;
                    return request;
                }).then(function (request) {
                    //执行查询
                    return post(request, selfRepository);
                });
            };

            Repository.prototype.refresh = function () {
                if (this._lastParams) {
                    var request = {
                        params: this._lastParams || {}
                    };
                    return post(request, this);
                }
            };

            function post(request, scope) {
                var postData = {};
                postData[self.actionKey] = {
                    name: scope._action,
                    params: request.params,
                    header:request.header
                };

                var result = $http.post(scope._baseURL, postData);

                result = result.then(function (response) {
                    //处理逻辑code
                    if (response.data.status === "100" || response.data.zz_status === '100') {
                        return response;
                    } else {
                        return $q.reject(response);
                    }
                }, function (error) {
                    return $q.reject(error);
                });

                //将全局响应拦截器插入
                angular.forEach(self._interceptors, function (value) {
                    result = result.then(value);
                });

                //写入请求对象
                result = result.then(function (response) {
                    response.request = request;
                    return response;
                });

                //记录Cache
                result = result.then(function (response) {
                    nptCache.useByResponse(response);
                    return response;
                });

                //记录本次检索数据
                result = result.then(function (response) {
                    scope.data = response.data;
                    return response;
                }, function (error) {
                    //如果处理错误方法,必须将驳回继续返回
                    scope.data = undefined;
                    return $q.reject(error);
                });

                //将实例拦响应截器插入
                angular.forEach((scope._responseInterceptors), function (value) {
                    result = result.then(value);
                });

                //记录promise
                scope.result = result;

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
                    var kv = {};
                    kv[key] = value;
                    angular.extend(target, kv);
                }
            }

            function repositoryFactory(action) {
                var repository = new Repository();
                repository.setAction(action);

                return repository;
            }

            return repositoryFactory;
        };
    }
)
;