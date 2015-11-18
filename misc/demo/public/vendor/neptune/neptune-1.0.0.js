angular.module("ui.neptune", [
    'ui.neptune.tpls',
    "ui.neptune.service",
    "ui.neptune.validator",
    "ui.neptune.filter",
    "ui.neptune.directive",
    "ui.neptune.formly"
]);

angular.module("ui.neptune.service", [
    "ui.neptune.service.resource",
    "ui.neptune.service.repository",
    "ui.neptune.service.cache",
    "ui.neptune.service.session",
    "ui.neptune.service.datatableStore",
    "ui.neptune.service.formStore"
]);

angular.module("ui.neptune.validator", [
    'ui.neptune.validator.number2date',
    'ui.neptune.validator.bizValidator'
]);

angular.module("ui.neptune.filter", ['' +
'ui.neptune.filter.bizFilter',
'ui.neptune.filter.commonFilter'
]);

angular.module("ui.neptune.directive", [
    "ui.neptune.directive.datatable",
    "ui.neptune.directive.selectTree",
    "ui.neptune.directive.form",
    "ui.neptune.directive.selectImage",
]);
;/**
 * Created by leon on 15/11/12.
 */
angular.module("ui.neptune.service.cache", [])
    .provider("nptCache", function () {
        this.data = {};

        this.$get = function () {
            var self = this;

            function Cache() {

            }

            Cache.prototype.useByResponse = function (response) {
                if (response.cache) {
                    angular.forEach(response.cache, function (value, key) {
                        var cacheData = self.data[key] || {};
                        self.data[key] = angular.extend(cacheData, value);
                    });
                }
                return response;
            };

            Cache.prototype.get = function (key, id) {
                //如果未指定任何需要查询的cache key以及id则返回全部cache
                if (!key && !id) {
                    return self.data;
                }

                //如果指定了key但是没有指定id则返回这个类型的cache
                if (key && !id) {
                    return self.data[key];
                }

                if (key && id && self.data[key]) {
                    return self.data[key][id];
                }
            };

            function cacheFactory() {
                return new Cache();
            }

            return cacheFactory();
        };

    }).filter('cacheFilter', function (nptCache) {
        return function (input, key, labelProp, valueProp) {
            if (!input || !key || !labelProp) { // 如果值为空，或者没有指定
                return input;
            }
            var datas = nptCache.get(key);
            if (datas && valueProp) {
                var output;
                angular.forEach(datas,function(data) {
                    if (data[valueProp] == input) {
                        output = data[labelProp];
                    }
                });
                return output;
            } else if (datas){
                return datas[input][labelProp];
            }
            return input;
        };
    });;/**
 * Created by leon on 15/11/9.
 */

angular.module("ui.neptune.service.datatableStore", [])
    .provider("nptDatatableStore", function () {

        this.datatables = {};

        this.datatable = function (name, datatable) {
            if (!datatable) {
                datatable = name;
                name = datatable.name;
            }

            if (!name) {
                throw new Error("datatable must have a name.");
            }
            this.datatable.name = name;
            this.datatables[name] = datatable;
            return this;
        };

        this.$get = function () {
            var self = this;
            var service = {
                /**
                 * 根据名称获取表单.
                 * @param name
                 * @param done
                 */
                datatable: function (name, done) {
                    if (name && done) {
                        if (self.datatables[name]) {
                            done(self.datatables[name]);
                        } else {
                            throw new Error("not found datatable " + name);
                        }
                    }
                },
                putDatatable: function (name, datatable) {
                    self.datatable(name, datatable);
                }
            };
            return service;

            //function Datatable(name) {
            //    this.name = name;
            //    this._header = [];
            //    this._action = [];
            //}
            //
            //Datatable.prototype.header = function header(header) {
            //    if (data && angular.isArray(header)) {
            //        this._header.concat(header);
            //    }
            //    return this;
            //};
            //
            //Datatable.prototype.action = function (name, action) {
            //
            //};
            //
            //
            //function datatableFactory(name) {
            //    var dataTable = new Datatable(name);
            //
            //
            //    return dataTable
            //}
            //
            //return datatableFactory;
        };
    });;/**
 * Created by leon on 15/11/9.
 */

angular.module("ui.neptune.service.formStore", [])
    .provider("nptFormStore", function () {

        this.formConfigs = {};

        this.form = function (name, form) {
            if (!form) {
                form = name;
                name = form.name;
            }

            if (!name) {
                throw new Error("formly must have a name.");
            }
            form.name = name;
            this.formConfigs[name] = form;
            return this;
        };


        this.$get = function () {
            var self = this;
            var service = {
                /**
                 * 根据名称获取表单.
                 * @param name
                 * @param done
                 */
                form: function (name, done) {
                    if (name && done) {
                        done(self.formConfigs[name]);
                    }
                },
                put: function (name, form) {
                    self.form(name, form);
                    return this;
                }
            };
            return service;
        };
    });;/**
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

            Repository.prototype.post = function (params) {
                var runParams = {};
                var selfRepository = this;
                //自上而下合并查询参数
                angular.extend(runParams, self.params || {});
                angular.extend(runParams, this._params || {});
                angular.extend(runParams, params || {});

                var request = {
                    params: runParams || {}
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
                    return post(this._lastParams, this);
                }
            };

            function post(request, scope) {
                var postData = {};
                postData[self.actionKey] = {
                    name: scope._action,
                    params: request.params
                };

                var result = $http.post(scope._baseURL, postData);

                result = result.then(function (response) {
                    //处理逻辑code
                    if (response.data.code === "100") {
                        return response;
                    } else {
                        return $q.reject(response.data.cause);
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

                //将实例拦响应截器插入
                angular.forEach((scope._responseInterceptors), function (value) {
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
;;/**
 * Created by leon on 15/11/3.
 */

angular.module("ui.neptune.service.resource", [])
    .provider("nptResource", function () {

        this.params = {};
        this.header = {};
        this.backendUrl = "/service";
        this.cache = {};
        this.originData = {};

        this.setBackendUrl = function (backendUrl) {
            this.backendUrl = backendUrl;
        };

        this.$get = function ($http) {

            var self = this;

            var service = {
                //调用资源
                post: function (name, params, success, error) {
                    params = params || {};
                    //加入固定查询参数
                    angular.extend(params, self.params);

                    $http.post(self.backendUrl, {
                        "y9action": {
                            name: name,
                            params: params
                        }
                    }).success(function (data) {
                        //记录原始数据
                        self.originData = data;
                        if (data.code === "100") {
                            //记录cache
                            if (data.cache) {
                                for (var key in data.cache) {
                                    var oldCache = self.cache[key] || {};
                                    self.cache[key] = angular.extend(oldCache, data.cache[key]);
                                }
                            }

                            //回调成功
                            if (success) {
                                success(data.data);
                            }
                        } else {
                            if (error) {
                                error(data);
                            }
                        }
                    }).error(function (data) {
                        self.originData = data;
                        if (error) {
                            error(data);
                        }
                    });
                },
                cache: function (key, id) {
                    //如果未指定任何需要查询的cache key以及id则返回全部cache
                    if (!key && !id) {
                        return self.cache;
                    }

                    //如果指定了key但是没有指定id则返回这个类型的cache
                    if (key && !id) {
                        return self.cache[key];
                    }

                    if (key && id && self.cache[key]) {
                        return self.cache[key][id];
                    }
                },
                originData: function () {
                    return self.originData;
                }
            };

            return service;
        };
    })
;;/**
 * Created by leon on 15/11/13.
 */

angular.module("ui.neptune.service.session", [])
    .provider("nptSession", function () {
        this._baseURL = "/session";
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
    });;/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module('ui.neptune.validator.bizValidator', ['ui.neptune.service.resource'])
    .directive('nptBizValidator', function ($q, nptResource, nptBizValidatorService, nptBizValidatorProvider, nptBizValidatorHelper) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elm, attr, ctrl) {
                var bizConfig = attr.nptBizValidatorOpts || {};
                if (!ctrl) return;
                ctrl.$asyncValidators.bizvalidate = function (modelValue, viewValue) {
                    var modeName = attr.ngModel;
                    var extraScope = {};
                    if(modeName)extraScope[modeName] = modelValue;
                    extraScope.$value = modelValue;
                    extraScope = angular.extend({}, scope, extraScope);
                    bizConfig = angular.isObject(bizConfig) ? bizConfig : angular.fromJson(bizConfig);
                    var baseConfig = nptBizValidatorProvider.getConfig(attr.nptBizValidator) || {};
                    bizConfig = nptBizValidatorHelper.extendConfig(baseConfig, bizConfig);
                    var bizName = bizConfig.bizName;
                    var validator = bizConfig.validator;
                    var bizParams = bizConfig.bizParams;
                    var validExpression = bizConfig.validExpression;
                    if (!validExpression){
                        validExpression={};
                        validExpression[attr.ngModel] = attr.ngModel;
                    }
                    if (!bizName || !validator) {
                        throw new Error('无效的nptBizValidator配置；' + (attr.name || attr.ngModel));
                    }
                    var deferred = $q.defer();

                    if (!bizName || !validator ||
                        ((angular.isString(validator) && !nptBizValidatorService[validator]) ||
                        (!angular.isString(validator) && !angular.isFunction(validator)))) {
                        deferred.reject(new Error('无效的nptBizValidator配置；' + (attr.name || attr.ngModel)));
                        return deferred.promise;
                    }
                    bizParams = nptBizValidatorHelper.parseParams(bizParams, extraScope);
                    nptResource.post(bizName, bizParams, function (data) {
                        validExpression = nptBizValidatorHelper.parseParams(validExpression, extraScope);
                        var result = nptBizValidatorHelper.execute(validator, data, validExpression);
                        if (result) {
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                };

                attr.$observe('nptBizValidatorOpts', function (config) {
                    bizConfig = config ? config : {};
                    ctrl.$validate();
                });

            }
        };
    }).factory('nptBizValidatorHelper', function ($parse, nptBizValidatorService) {
        return {
            extendConfig: function (baseConfig, bizConfig) {
                if (baseConfig.bizParams) {
                    baseConfig.bizParams = angular.extend(baseConfig.bizParams, bizConfig.bizParams || {});
                    delete bizConfig.bizParams;
                }
                return angular.extend(baseConfig, bizConfig);
            },
            parseParams: function (config, scope) {
                if (angular.isObject(config)) {
                    var ret = {};
                    for (var key in config) {
                        ret[key] = this.parseParams(config[key], scope);
                    }
                    return ret;
                } else if (angular.isDefined(config)) {
                    return $parse(config)(scope);
                }
                return undefined;
            },
            execute: function (validator, data, expression) {
                if (angular.isString(validator)) {
                    return nptBizValidatorService[validator](data, expression);
                } else if (angular.isFunction(validator)) {
                    return validator(data, expression);
                }
                throw new Error('无法执行验证器：' + validator);
            }
        };
    })
    .service('nptBizValidatorService', function ($filter) {
        this.exist = function (data, expression) {
            if (!data) {
                return false;
            }
            if (!expression) { // 不存在表达式
                if (angular.isArray(data)) {
                    return data.length > 0;
                } else {
                    return !!data;
                }
            }
            var resultArr = [];
            if (angular.isString(expression)) {
                resultArr = $filter('filter')(angular.isArray(data) ? data : [data], expression);
            } else {
                resultArr = $filter('filter')(angular.isArray(data) ? data : [data], function (value, index, array) {
                    for (var key in expression) {
                        if (expression[key] != value[key]) {
                            return false;
                        }
                    }
                    return true;
                });
            }
            if (resultArr && resultArr.length > 0) {
                return true;
            }
            return false;

        };
        this.noExist = function (data, expression) {
            return !this.exist(data, expression);
        };
    }).provider('nptBizValidatorProvider', function () {
        var config = {};
        this.addConfig = function (name, bizConfig) {
            config[name] = bizConfig;
        };
        this.$get = function () {
            return {
                getConfig: function (name) {
                    if (!name)return undefined;
                    var conf = config[name];
                    if (!conf) return undefined;
                    return angular.copy(conf);
                }
            };
        };
    }).config(function (nptBizValidatorProviderProvider) {
        /**
         * 增加配置说明：
         * 通过nptBizValidatorProviderProvider.addConfig增加配置
         * addConfig 第一个参数为配置名称
         * 第二个参数为配置对象，其中：
         *bizName：
         * bizParams：
         * validator：
         * validExpression：
         */
        //nptBizValidatorProviderProvider.addConfig('ordersnExist', {
        //    "bizName": "queryOrderList",
        //    "validator": "exist",
        //    "validExpression": {
        //        "ordersn": "ordersn"
        //    }
        //});
        //
        //nptBizValidatorProviderProvider.addConfig('ordersnExist2', {
        //    "bizName": "queryOrderList",
        //    "bizParams": {"userid": "10000001498059", "instid": "session.instid"},
        //    "validator": function (data, expression) {
        //        if (data) {
        //            for (var i = 0; i < data.length;i++) {
        //                if (data[i].ordersn == expression) {
        //                    return true;
        //                }
        //            }
        //        }
        //        return false;
        //    }
        //});
    });;/**
 * Created by leon on 15/11/5.
 */
angular.module("ui.neptune.validator.number2date", [])
    .directive("nptNumber2date", function () {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, ctrl) {
                var validateFn = function (value) {
                    var valid = false;
                    var stringValue = value + "";
                    if (value && stringValue.length === 8) {
                        var newValue = stringValue.substring(0, 4) + "/" + stringValue.substring(4, 6) + "/" + stringValue.substring(6, 8);
                        var date = new Date(newValue);
                        if (isNaN(date)) {
                            //不是日期格式
                            valid = false;
                        } else {
                            //日期格式正确
                            valid = true;
                        }
                    }
                    ctrl.$setValidity("nptNumber2date", valid);
                    return value;
                };

                ctrl.$parsers.push(validateFn);
                ctrl.$formatters.push(validateFn);

                //scope.$watch(attrs.number2date, function () {
                //    ctrl.$setViewValue(ctrl.$viewValue);
                //});
            }
        };
    });;/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */
angular.module('ui.neptune.filter.bizFilter', ['ui.neptune.service.resource'])
    .directive('nptBizFilter', function ($parse, nptResource, nptBizFilterHelper) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elm, attr, ctrl) {
                var filterConfig = attr.nptBizFilter;
                if (!filterConfig)throw new Error('无效的指令器配置,' + attr.ngModel);
                var filters = filterConfig.split("|");
                var modelName = filters[0] || attr.ngModel;
                var asNameArray = filters[filters.length - 1].split(/\s+as\s+/);
                var asName = (asNameArray.length == 2) ? asNameArray[1] :  attr.ngModel;
                filters[filters.length - 1] = (asNameArray.length == 2) ? asNameArray[0] : filters[filters.length - 1];
                scope.$watch(modelName, function (newValue, oldValue) {
                    var extraScope = {};
                    extraScope.$value = newValue;
                    extraScope = angular.extend({}, scope, extraScope);
                    nptBizFilterHelper.fire($parse(filters[0])(extraScope), filters.slice(1), extraScope)
                        .then(function (data) {
                            if (asName) {
                                var setter = $parse(asName).assign;
                                setter(scope,data);
                            } else {
                                data = angular.isObject(data) ? angular.fromJson(data) : data;
                                $(elm).html(data);
                            }
                        }, function (error) {
                            throw error;
                        });
                });
            }
        };
    })
    .service('nptBizFilterHelper', function ($q, $filter, $parse, nptBizFilterProvider, nptResource) {
        this.fire = function (originData, filters, scope) {
            var deferred = $q.defer();
            var self = this;
            var index = 0;
            var doFilter = function (data) {
                if (index == filters.length) {
                    deferred.resolve(data);
                    return;
                }
                var currentFilter = filters[index];
                self.filter(data, currentFilter, scope).then(function (nData) {
                    index++;
                    doFilter(nData);
                }, function (error) {
                    throw error;
                });
            };
            this.filter(originData).then(function (data) {
                doFilter(data);
            });

            return deferred.promise;
        };
        this.filter = function (data, filterExpression, scope) {
            var deferred = $q.defer();
            if (!filterExpression) {
                deferred.resolve(data);
                return deferred.promise;
            }
            filterExpression = this.parseFilterExpression(filterExpression, scope);
            var filterName = filterExpression.filterName,
                expression = filterExpression.expression;

            var bizConfig = nptBizFilterProvider.getConfig(filterName);
            if (bizConfig) { // 存在业务过滤器，需要异步处理
                return this.doBizFilter(filterName, expression, scope);
            } else {
                deferred.resolve($filter(filterName)(data, expression));
                return deferred.promise;
            }
        };
        this.doBizFilter = function (name, params, scope) {
            var deferred = $q.defer();
            params = params || {};
            params = angular.isObject(params) ? params : angular.fromJson(params);
            var bizConfig = nptBizFilterProvider.getConfig(name);
            bizConfig.bizParams = bizConfig.bizParams || {};
            bizConfig.bizParams = this.linkContex(bizConfig.bizParams, scope);
            angular.extend(bizConfig.bizParams, params);
            var self = this;
            nptResource.post(bizConfig.bizName, bizConfig.bizParams, function (data) {
                if (bizConfig.chains) {
                    self.fire(data, bizConfig.chains, scope).then(function (cData) {
                        deferred.resolve(cData);
                    });
                } else {
                    deferred.resolve(data);
                }
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        this.linkContex = function (param, scope) {
            if (angular.isObject(param)) {
                var linkedParam = {};
                for (var key in param) {
                    linkedParam[key] = this.linkContex(param[key], scope);
                }
                return linkedParam;
            }
            return this.quoteValueOfExpression($parse(param)(scope), scope);
        };

        this.quoteValueOfExpression = function (expression) {
            if (!angular.isString(expression)) {
                return expression;
            }
            var needQuoteOperate = {
                "!==": /!==\s*/,
                "===": /===\s*/,
                "==": /==\s*/,
                "<=": /<=\s*/,
                ">=": />=\s*/,
                "!=": /!=\s*/,
                "<": /<\s*/,
                ">": />\s*/,
                "=": /=\s*/
            };
            for (var op in needQuoteOperate) {
                var arr = expression.split(needQuoteOperate[op]);
                if (arr.length == 2) {
                    if (angular.isString(arr[1]) &&
                        arr[1].indexOf("\"") !== 0 &&
                        arr[1].indexOf("'") !== 0) {
                        return arr[0] + op + "\"" + arr[1] + "\"";
                    }
                }

            }
            return expression;
        };

        this.parseFilterExpression = function (filterExpression, scope) {
            if (!filterExpression) {
                return {};
            }
            if (filterExpression.indexOf(":") > 0) {
                var parsedExpression = {};
                filterExpression = filterExpression.split(":");
                var filterName = filterExpression[0];
                filterExpression = filterExpression.slice(1);
                filterExpression = filterExpression.join(":");
                filterExpression = filterExpression.startsWith("{") ? angular.fromJson(filterExpression) : filterExpression;
                parsedExpression.filterName = filterName;
                parsedExpression.expression = this.linkContex(filterExpression, scope);
                return parsedExpression;
            } else {
                return {
                    filterName: filterExpression
                };
            }
        };
    })
    .filter('pickup', function ($parse) {
        return function (input, expression) {
            var output = input;
            if (angular.isArray(input)) {
                output = input[0];
            } else if (!angular.isObject(input)) {
                return output;
            }
            output = output || {};
            return $parse(expression)(output);
        };
    })
    .provider('nptBizFilterProvider', function () {
        var config = {};
        this.addConfig = function (name, bizConfig) {
            config[name] = bizConfig;
        };
        this.$get = function () {
            return {
                getConfig: function (name) {
                    if (!name)return undefined;
                    var conf = config[name];
                    if (!conf) return undefined;
                    return angular.copy(conf);
                }
            };
        };
    }).config(function (nptBizFilterProviderProvider) {
        //nptBizFilterProviderProvider.addConfig('orderFilter', {
        //    "bizName": "queryOrderList",
        //    "bizParams": {"instid": "session.instid"},
        //    "chains":["limitTo: 5"]
        //});
    });;/*!
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
});;/**
 * Created by leon on 15/10/28.
 */

angular.module("ui.neptune.directive.datatable", ['ui.bootstrap', "formly", "formlyBootstrap"])
    .constant("DatatableConfig", function () {
        return {
            currPage: 1,
            maxSize: 10,
            itemsPerPage: 5,
            isIndex: false,
            isPagination: false
        };
    })
    .controller("datatableController", ["$scope", "$attrs", "DatatableConfig", "nptFormStore", "$uibModal", "$q", "$injector", function ($scope, $attrs, datatableConfig, nptFormStore, $uibModal, $q, $injector) {
        var self = this;

        if ($scope.controller) {
            $scope.controller = this;
        }

        this.$datatable = {
            init: function (config, scope) {
                var selfDt = this;

                this.header.init(config.header);
                this.action.init(config.action);
                selfDt.page.init(datatableConfig(), scope);

                if (scope.onAddListens) {
                    for (var i in scope.onAddListens) {
                        this.putAddListen(scope.onAddListens[i]);
                    }
                }

                if (scope.onDelListens) {
                    for (var j in scope.onDelListens) {
                        this.putDelListen(scope.onDelListens[j]);
                    }
                }

                if (scope.onEditListens) {
                    for (var k in scope.onEditListens) {
                        this.putEditListen(scope.onEditListens[k]);
                    }
                }

            },
            putAddListen: function (listen) {
                if (typeof listen === "function") {
                    this.onAddListens.push(listen);
                }
            },
            putDelListen: function (listen) {
                if (typeof listen === "function") {
                    this.onDelListens.push(listen);
                }
            },
            putEditListen: function (listen) {
                if (typeof listen === "function") {
                    this.onEditListens.push(listen);
                }
            },
            onAddListens: [],
            onDelListens: [],
            onEditListens: [],
            handler: {
                add: function (action, item, index) {
                    var result = self.$forms.open(action.target, {});
                    if (result) {
                        result = result.then(function (data) {
                            var params = {
                                action: action,
                                index: index,
                                data: data
                            };

                            var promisesArr = [];
                            angular.forEach(self.$datatable.onAddListens, function (value) {
                                if (angular.isFunction(value)) {
                                    promisesArr.push($q.when($injector.invoke(value, this, {
                                        "params": params
                                    })));
                                }
                            });

                            //配置中的listen
                            angular.forEach(action.listens, function (value) {
                                promisesArr.push($q.when($injector.invoke(value, this, {
                                    "params": params
                                })));
                            });

                            $q.all(promisesArr).then(function () {
                                //执行成功,将数据添加到表格
                                $scope.data.push(params.data);
                                console.info("添加执行成功.");
                            }, function (error) {
                                console.info("添加执行失败!" + JSON.stringify(error));
                            });

                        }, function (error) {
                            console.info("添加操作取消");
                        });
                        return result;
                    }
                },
                del: function (action, item, index) {
                    var deferd = $q.defer();
                    var promise = deferd.promise;

                    var params = {
                        action: action,
                        item: item,
                        index: index
                    };

                    deferd.resolve(params);

                    promise.then(function (data) {
                        console.info("开始删除数据");
                    }, function (error) {
                        console.info("删除数据错误!" + error);
                    });

                    var promisesArr = [promise];
                    angular.forEach(self.$datatable.onDelListens, function (value) {
                        if (angular.isFunction(value)) {
                            promisesArr.push($q.when($injector.invoke(value, this, {
                                "params": params
                            })));
                        }
                    });

                    //配置中的listen
                    angular.forEach(action.listens, function (value) {
                        promisesArr.push($q.when($injector.invoke(value, this, {
                            "params": params
                        })));
                    });

                    var result = $q.all(promisesArr).then(function () {
                        $scope.data.splice(params.index, 1);
                    }, function (error) {
                        console.info("删除失败!" + error);
                    });

                    return result;
                },
                edit: function (action, item, index) {
                    var result = self.$forms.open(action.target, item);
                    if (result) {
                        result.then(function (data) {
                            //重新组织参数
                            var params = {
                                action: action,
                                index: index,
                                data: data,
                                item: angular.copy(item) //防止修改
                            };
                            var promisesArr = [];
                            angular.forEach(self.$datatable.onEditListens, function (value) {
                                if (angular.isFunction(value)) {
                                    promisesArr.push($q.when($injector.invoke(value, this, {
                                        "params": params
                                    })));
                                }
                            });

                            //配置中的listen
                            angular.forEach(action.listens, function (value) {
                                promisesArr.push($q.when($injector.invoke(value, this, {
                                    "params": params
                                })));
                            });

                            $q.all(promisesArr).then(function (data) {
                                console.info("编辑操作成功!");
                                //将新数据更新到表格
                                angular.extend(item, params.data);
                            }, function (error) {
                                console.info("编辑操作失败!");
                            });

                        }, function (error) {
                            console.info("编辑操作取消");
                        });
                    }

                    return result;
                },
                none: function (action, item, index) {
                    if ($scope.onAction) {
                        $scope.onAction({
                            action: action,
                            item: item,
                            index: index
                        });
                    }
                }
            },
            header: {
                init: function (config) {
                    if (config) {
                        for (var key in config) {
                            this.items.push({
                                name: key,
                                label: config[key].label
                            });
                        }
                    }
                },
                items: []
            },
            action: {
                init: function (config) {
                    if (config) {
                        for (var key in config) {
                            var action = {
                                name: key,
                                label: config[key].label,
                                type: config[key].type || "none",
                                target: config[key].target || undefined,
                                listens: config[key].listens || []
                            };
                            this.items.push(action);
                        }
                    }
                },
                items: [],
                onClick: function (action, item, index) {
                    if (self.$datatable.handler[action.type]) {
                        self.$datatable.handler[action.type](action, item, index);
                    }
                }
            },
            page: {
                init: function (config, scope) {
                    this.currPage = scope.currPage || config.currPage;
                    this.totalItems = 0;
                    if (scope.data) {
                        this.totalItems = scope.data.length || 0;
                    }
                    this.maxSize = config.maxSize;
                    this.itemsPerPage = scope.itemsPerPage || config.itemsPerPage;

                    this.isIndex = scope.isIndex || config.isIndex;
                    this.isPagination = scope.isPagination || config.isPagination;
                },
                data: [],
                pageChange: function (data) {
                    //初始化分页数据
                    this.data = [];
                    var endIndex = 0;
                    var beginIndex = 0;

                    if (this.isPagination) {
                        endIndex = this.currPage * this.itemsPerPage;
                        beginIndex = this.currPage * this.itemsPerPage - this.itemsPerPage;
                    } else {
                        beginIndex = 0;
                        endIndex = 0;
                        if (data) {
                            endIndex = data.length;
                        }
                    }

                    if (data) {
                        for (beginIndex; beginIndex < endIndex; beginIndex++) {
                            if (beginIndex >= data.length) {
                                break;
                            } else {
                                this.data.push(data[beginIndex]);
                            }
                        }
                    }
                }
            }
        };
        $scope.datatable = this.$datatable;

        this.$forms = {
            init: function () {
            },
            open: function (name, data) {
                this.originData = data;
                var formData = {};
                angular.copy(data, formData);

                var result = $uibModal.open({
                    animation: true,
                    templateUrl: '/template/datatable/datatable-edit.html',
                    controller: 'editDatatableController',
                    controllerAs: 'vm',
                    resolve: {
                        formData: function ($q) {
                            var deferd = $q.defer();
                            nptFormStore.form(name, function (config) {
                                deferd.resolve({
                                    fields: config.fields,
                                    model: formData,
                                    options: config.options
                                });
                            });
                            return deferd.promise;
                        }
                    }
                }).result;

                return result;
            },
            close: function () {
                $uibModal.close();
            }
        };
        $scope.forms = this.$forms;
    }])
    .controller("editDatatableController", function ($modalInstance, formData) {
        var vm = this;
        // function assignment
        vm.ok = ok;
        vm.cancel = cancel;

        // variable assignment
        vm.formData = formData;
        vm.originalFields = angular.copy(vm.formData.fields);

        // function definition
        function ok() {
            $modalInstance.close(vm.formData.model);
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    })
    .directive("nptDatatable", ['$parse', "nptDatatableStore", function ($parse, nptDatatableStore) {
        return {
            restrict: "E",
            controller: "datatableController",
            transclude: true, //将元素的内容替换到模板中标记了ng-transclude属性的对象上
            replace: true, //使用template的内容完全替换y9ui-datatable(自定义指令标签在编译后的html中将会不存在)
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/datatable/datatable.html";
            },
            scope: {
                name: "@",
                options: "=?", //标题配置
                data: "=",   //表格数据
                isIndex: "=?", //是否显示序号
                isPagination: "@",//是否分页
                itemsPerPage: "=?", //每页显示行数
                controller: "=",
                onAction: "&",
                onAddListens: "=",
                onEditListens: "=",
                onDelListens: "="
            },
            link: function (scope, element, attrs, ctrl) {
                if (scope.options) {
                    ctrl.$datatable.init(scope.options, scope);

                } else {
                    nptDatatableStore.datatable(scope.name, function (config) {
                        ctrl.$datatable.init(config, scope);
                    });
                }

                ctrl.$forms.init();

                //监控数据集合是否发生改变
                scope.$watchCollection("data", function (newValue, oldValue) {
                    //如果存在数据则出发第一页
                    if (angular.isDefined(newValue) && newValue !== null) {
                        //刷新总行数
                        ctrl.$datatable.page.totalItems = newValue.length;
                        ctrl.$datatable.page.pageChange(scope.data);
                    }
                });

                scope.$watch("datatable.page.currPage", function (newValue, oldValue) {
                    ctrl.$datatable.page.pageChange(scope.data);
                });

                if (attrs.name && scope.$parent) {
                    var setter = $parse(attrs.name).assign;
                    setter(scope.$parent, ctrl);
                }
            }
        };
    }]);;/**
 * Created by leon on 15/10/29.
 */

angular.module("ui.neptune.directive.form", [])
    .controller("FormControllect", ["$scope", function ($scope) {

        this.init = function () {

        };

        $scope.doAction = function (item) {
            if (angular.isDefined($scope.onClickAction)) {
                $scope.onClickAction({
                    item: item
                });
            }
        };

        $scope.doSave = function () {
            console.info("保存表单");
        };

        $scope.doReset = function () {
            console.info("重置表单");
        };

    }])
    .directive("nptForm", [function () {
        return {
            restrict: "E",
            controller: "FormControllect",
            replace: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/form/form.html";
            },
            scope: {
                model: "=?",
                data: "=",
                onClickAction: "&",
                onSave: "&",
                onReset: "&"
            },
            compile: function (element) {
                //初始化界面html
                return {
                    pre: function (scope, element, attrs, ctrls) {
                        //
                        //if (attrs.name && !scope.model) {
                        //    .model(attrs.name, function (model) {
                        //        scope.model = model;
                        //    });
                        //}
                    },
                    post: function (scope, element, attrs, ctrls) {
                        //var demo = element;
                    }
                };
            }
        };
    }]);;/**
 * Created by leon on 15/11/16.
 */
angular.module("ui.neptune.directive.selectImage", ['ui.bootstrap'])
    .controller("SelectImageController", function ($scope, $uibModal) {
        var vm = this;
        vm.options = $scope.nptSelectImage;

        vm.selectImageApi = {
            open: function () {
                var result = $uibModal.open({
                    animation: true,
                    templateUrl: '/template/select-image/select-image-modal.html',
                    controller: 'SelectImageModalController',
                    controllerAs: 'vm',
                    resolve: {
                        selectImageData: function ($q) {
                            var deferd = $q.defer();
                            if (vm.options.imageRepository) {
                                deferd.resolve(vm.options);
                            } else {
                                deferd.reject();
                            }
                            return deferd.promise;
                        }
                    }
                }).result;
                return result;
            }
        };

        //回调设置API
        if (vm.options.onRegisterApi) {
            vm.options.onRegisterApi(vm.selectImageApi);
        }
        //设置默认选择类型
        vm.options.single = vm.options.single || false;

    })
    .controller("SelectImageModalController", function (selectImageData, $modalInstance, nptCache) {
        var vm = this;

        vm.ok = ok;
        vm.cancel = cancel;
        vm.refreshImage = refreshImage;
        vm.selectImage = selectImage;
        vm.refreshNum = refreshNum;
        vm.selectNum = 0;
        vm.options = selectImageData;

        // function definition
        function ok() {
            //检查已经选择的图片
            $modalInstance.close(getSelectImages());
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function selectImage(item) {
            if (item) {
                if (vm.options.single) {
                    //将所有设置为非选择
                    setAllSelected(false);
                    item.selected = true;
                } else {
                    item.selected = !item.selected;
                }
                refreshNum();
            }
        }

        function refreshNum() {
            vm.selectNum = getSelectImages().length;
        }

        function getSelectImages() {
            var selectedImages = [];
            if (vm.images) {
                angular.forEach(vm.images, function (imageRows) {
                    angular.forEach(imageRows, function (value) {
                        if (value.selected) {
                            selectedImages.push(value);
                        }
                    });
                });
            }
            return selectedImages;
        }

        function setAllSelected(state) {
            if (vm.images) {
                angular.forEach(vm.images, function (imageRows) {
                    angular.forEach(imageRows, function (value) {
                        value.selected = state;
                    });
                });
            }
        }

        function refreshImage() {
            if (vm.options.imageRepository) {
                vm.refresh = vm.options.imageRepository.post().then(function (response) {

                    vm.images = [];
                    var rows = [];
                    var index = 0;
                    angular.forEach(response.data, function (value) {

                        if (index >= 4) {
                            vm.images.push(angular.copy(rows));
                            index = 0;
                            rows = [];
                        }
                        //查找cache中的url
                        var file = nptCache.get("file", value.id);
                        var imageWrapper = {
                            file: file,
                            data: value,
                            selected: false
                        };
                        rows.push(imageWrapper);
                        index++;
                    });

                    if (rows) {
                        vm.images.push(angular.copy(rows));
                    }

                    console.info("检索成功!");
                }, function (error) {
                    console.info("检索失败!");
                });
            }
        }

        //刷新图片
        refreshImage();
    })
    .directive("nptSelectImage", function () {
        return {
            restrict: "EA",
            transclude: true, //将元素的内容替换到模板中标记了ng-transclude属性的对象上
            replace: true, //使用template的内容完全替换y9ui-datatable(自定义指令标签在编译后的html中将会不存在)
            controller: "SelectImageController",
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/select-image/select-image.html";
            },
            scope: {
                nptSelectImage: "="
            },
            link: function (scope, element, attrs, ctrl) {
            }
        };
    });;/**
 * Created by leon on 15/11/5.
 */

angular.module("ui.neptune.directive.selectTree", ['ui.bootstrap', 'ui.tree', 'ui.grid', 'ui.grid.selection'])
    .controller("SelectTreeController", function ($scope, $uibModal) {
        var self = this;

        this.selectTreeApi = {
            open: function () {
                var selfApi = this;
                var result = $uibModal.open({
                    animation: true,
                    templateUrl: '/template/select-tree/select-tree-modal.html',
                    controller: 'SelectTreeModalController',
                    controllerAs: 'vm',
                    resolve: {
                        selectTreeData: function ($q) {
                            var deferd = $q.defer();
                            if (selfApi.treeRepository && selfApi.listRepository) {
                                var params = {
                                    treeRepository: selfApi.treeRepository,
                                    listRepository: selfApi.listRepository
                                };
                                deferd.resolve(params);
                            } else {
                                deferd.reject();
                            }
                            return deferd.promise;
                        }
                    }
                }).result;
                return result;
            }
        };

        //初始化配置
        if ($scope.nptSelectTree) {
            //获取资源仓库
            if ($scope.nptSelectTree.treeRepository) {
                self.selectTreeApi.treeRepository = $scope.nptSelectTree.treeRepository;
            }

            if ($scope.nptSelectTree.listRepository) {
                self.selectTreeApi.listRepository = $scope.nptSelectTree.listRepository;
            }

            if ($scope.nptSelectTree.onRegisterApi) {
                $scope.nptSelectTree.onRegisterApi(this.selectTreeApi);
            }
        }


    })
    .controller("SelectTreeModalController", function ($scope, selectTreeData, $modalInstance) {
        var vm = this;
        // function assignment
        vm.ok = ok;
        vm.cancel = cancel;

        // function definition
        function ok() {
            var selectData = $scope.gridApi.selection.getSelectedRows();
            $modalInstance.close(selectData);
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        vm.refreshTree = function () {
            if (selectTreeData.treeRepository) {
                vm.refresh = selectTreeData.treeRepository.post().then(function (data) {
                    vm.treeData = data;
                });
            }
        };

        vm.refreshList = function (node) {
            if (selectTreeData.listRepository) {
                vm.refresh = selectTreeData.listRepository.post(node).then(function (response) {
                    vm.gridOptions.data = response.data;
                });
            }
        };

        //tree点击
        vm.onTreeClick = function (node) {
            vm.refreshList(node);
        };

        vm.gridOptions = {
            enableRowSelection: true,
            enableSelectAll: false,
            enableFullRowSelection: true,
            selectionRowHeaderWidth: 35,
            rowHeight: 35,
            showGridFooter: true,
            multiSelect: false,
            data: [],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            },
            columnDefs: [
                {name: 'name', displayName: "名称"}
            ]
        };

        //初始刷新tree
        vm.refreshTree();

    }).directive("nptSelectTree", [function () {
        return {
            restrict: "A",
            transclude: true, //将元素的内容替换到模板中标记了ng-transclude属性的对象上
            replace: true, //使用template的内容完全替换y9ui-datatable(自定义指令标签在编译后的html中将会不存在)
            controller: "SelectTreeController",
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/select-tree/select-tree.html";
            },
            scope: {
                nptSelectTree: "="
            },
            link: function (scope, element, attrs, ctrl) {
            }
        };
    }]);
;/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly", [
    "ui.neptune.formly.ui-select",
    "ui.neptune.formly.ui-mask",
    "ui.neptune.formly.ui-validation",
    "ui.neptune.formly.wrapper-validation",
    "ui.neptune.formly.select-tree-single",
    "ui.neptune.formly.select-image"]);

angular.module("ui.neptune.formly.ui-select",
    ["ui.neptune.service.resource", 'ui.select', 'ngSanitize',
        'ngAnimate',
        'ngMessages', "angular.filter"]);

angular.module("ui.neptune.formly.ui-mask", ['ui.utils.masks', "ui.mask"]);

angular.module("ui.neptune.formly.ui-validation", []).constant('is', window.is);
angular.module("ui.neptune.formly.ui-mask", ['ui.utils.masks', "ui.mask"]);

angular.module("ui.neptune.formly.wrapper-validation", []);
;/**
 * Created by leon on 15/11/17.
 */

angular.module("ui.neptune.formly.select-image", [])
    .config(function (formlyConfigProvider) {
        formlyConfigProvider.setType({
            name: "npt-select-image",
            templateUrl: "/template/formly/npt-select-image.html",
            extends: 'input',
            defaultOptions: {
                templateOptions: {
                    onSelect: function (model, options) {
                        var self = this;
                        self.selectImageApi.open().then(function (response) {
                            self.selectedImages = response;
                            //如果是单选,则将第一行设置为数据, 如果是多选则提取所有数据的id
                            if (self.single && response && response.length > 0) {
                                model[options.key] = response[0].data[self.valueProp];
                            } else if (!self.single && response) {
                                model[options.key] = [];
                                angular.forEach(response, function (value) {
                                    model[options.key].push(value.data[self.valueProp]);
                                });
                            }

                        }, function () {

                        });
                    },
                    onRegisterApi: function (selectImageApi) {
                        this.selectImageApi = selectImageApi;
                    },
                    imageRepository: undefined,
                    single: false,
                    valueProp: 'id'
                }
            }
        });
    });;/**
 * Created by leon on 15/11/16.
 */


angular.module("ui.neptune.formly.select-tree-single", [], function config(formlyConfigProvider) {
    formlyConfigProvider.setType({
        name: "npt-select-tree-single",
        templateUrl: "/template/formly/npt-select-tree-single.html",
        extends: 'input',
        defaultOptions: {
            controller: function ($scope, $log, $injector) {
                var options = $scope.options;
                var to = options.templateOptions;

                //监听数据,如果发生变化重新检索远程显示值
                $scope.$watch("model." + options.key, function (newValue, oldValue) {
                    if (newValue && to.viewvalueRepository) {
                        if (angular.isFunction(to.viewvalueRepository)) {
                            to.viewvalue = $injector.invoke(to.viewvalueRepository);
                        } else {
                            var params = {};
                            params[to.viewvalueQueryProp] = newValue;
                            to.viewvalueRepository.post(params).then(function (response) {
                                to.viewvalue = response.data[to.viewvalueProp];
                            }, function (error) {
                                //发生错误清空模型数据
                                $scope.model[options.key] = undefined;
                            });
                        }
                    }
                });

            },
            templateOptions: {
                label: "请选择:",
                placeholder: "请选择.",
                valueProp: 'id',
                labelProp: 'name',
                viewvalueQueryProp: "id",
                viewvalueProp: "name",
                viewvalue: undefined,
                onClickSelect: function (modal, options) {
                    var self = this;

                    self.selectTreeApi.open().then(function (response) {
                        if (response && response.length > 0) {
                            modal[options.key] = response[0][self.valueProp];
                            self.viewvalue = response[0][self.labelProp];
                        }
                    }, function () {
                    });
                },
                onRegisterApi: function (selectTreeApi) {
                    this.selectTreeApi = selectTreeApi;
                },
                treeRepository: undefined,
                listRepository: undefined,
                viewvalueRepository: undefined
            }
        }
    });
});;/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly.ui-mask")
    .run(function (formlyConfig,uiMaskDateFactory) {
        /*使用UI-MASK插件，由使用者自定义值格式*/
        formlyConfig.setType({
            name: 'maskedInput',
            extends: 'input',
            defaultOptions: {
                ngModelAttrs: {
                    mask: {
                        attribute: 'ui-mask'
                    },
                    maskPlaceholder: {
                        attribute: 'ui-mask-placeholder'
                    },
                    maskPlaceholderChar: {
                        attribute:'ui-mask-placeholder-char'
                    }
                },
                templateOptions: {
                    maskPlaceholder: ''
                }
            }
        });
        /*规定数字类型格式*/
        formlyConfig.setType({
            name: 'numberInput',
            extends: 'input',
            defaultOptions: {
                ngModelAttrs: {
                    numberMask: {
                        attribute: 'ui-number-mask'
                    },
                    negativeNumber: {
                        attribute: 'ui-negative-number'
                    },
                    min: {
                        attribute:'min'
                    },
                    max: {
                        attribute:'max'
                    }
                },
                templateOptions: {
                    numberMask: '2',
                    negativeNumber:''
                }
            }
        });

        /*规定时间戳类型格式*/
        formlyConfig.setType({
            name: 'dateInput',
            extends: 'input',
            defaultOptions: {
                ngModelAttrs: {
                    mask: {
                        attribute: 'ui-mask'
                    },
                    maskPlaceholder: {
                        attribute: 'ui-mask-placeholder'
                    },
                    maskPlaceholderChar: {
                        attribute:'ui-mask-placeholder-char'
                    }
                },
                templateOptions: {
                    maskPlaceholder: ''
                },
                expressionProperties:{
                    'templateOptions.mask':'to.formateType =="short"?"9999-99-99":"9999-99-99 99:99:99"'
                },
                parsers:[uiMaskDateFactory.parseToDate],
                formatters:[uiMaskDateFactory.formateToString]
            }
        });
    }).factory('uiMaskDateFactory',function($filter) {
        var factory = {};

        factory.parseToDate = function(viewValue,modleValue,scope) {
            if (!viewValue) {
                return viewValue;
            }
            var date = new Date(scope.fc.$viewValue.replace(/-/,"/")).getTime();
            return date||undefined;
        };
        factory.formateToString = function(viewValue,modleValue,scope) {
            if (!modleValue) {
                return modleValue;
            }
            if (angular.isNumber(modleValue)) {
                var dateFilter = $filter('date');
                var formateString =
                    scope.to.formateType=="short"?"yyyy-MM-dd":'yyyy-MM-dd hh:mm:ss';
                var dateString = dateFilter(modleValue,formateString);
                return dateString|| undefined;
            }
        };
        return factory;
    });;/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly.ui-select")
    .run(function (formlyConfig, $q) {
        formlyConfig.setType({
            name: 'ui-select',
            extends: 'select',
            templateUrl: "/template/formly/ui-select.html",
            defaultOptions: {
                templateOptions: {
                    ngOptions: 'option[to.valueProp] as option in to.options | filterBy:[to.valueProp,to.labelProp]: $select.search',
                    refresh: function refresh(value, model, field) {
                        //刷新逻辑
                        //1 如果存在searchProp和repository,表示根据输入内容动态检索
                        //2 如果存在options,表示使用静态选择
                        //3 如果存在repository,表示单次检索资源
                        //4 其他情况返回空数据

                        //默认空内容
                        var promise = $q.when({
                            data: []
                        });

                        if (field.templateOptions.searchProp && field.templateOptions.repository) {
                            //存在searchProp以及repository,表示按输入条件检索
                            //model[field.key];
                            //此处会有一个暂时不好解决的问题.如果当前模型数据上有值,在首次刷新页面后,由于没有输入值,会导致此处不刷新后台数据,
                            //从而导致界面显示空,但是实际有模型数据
                            if (!value) {

                            } else {
                                //检查到输入内容,检索数据
                                var params = field.templateOptions.repositoryParams || {};
                                params[field.templateOptions.searchProp] = value;
                                promise = field.templateOptions.repository.post(params);
                            }
                        } else if (field.templateOptions.options && field.templateOptions.options.length > 0) {
                            //存在options,使用静态选择
                            promise = $q.when({
                                data: field.templateOptions.options
                            });
                        } else if (field.templateOptions.repository) {
                            //存在repository表示,检索资源作为待选列表,只在首次检索
                            promise = field.templateOptions.repository.post(field.templateOptions.repositoryParams || {});
                        }

                        return promise.then(function (response) {
                            field.templateOptions.options = angular.isArray(response.data)?response.data:[response.data];
                        });
                    },
                    refreshDelay: 0
                }
            }
        });
    });;/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly.ui-validation")
    .run(function (formlyConfig, is,$q,QueryCtrlCode) {

        // 集成IS框架

        addTypeForValidator('boolean');
        addTypeForValidator('date');// Date
        addTypeForValidator('nan');// NaN
        addTypeForValidator('null');
        addTypeForValidator('string');
        addTypeForValidator('char');
        addTypeForValidator('undefined');
        addTypeForValidator('empty');
        addTypeForValidator('existy');// not null,not undefinder
        addTypeForValidator('truthy');// 有值
        addTypeForValidator('space');
        addTypeForValidator('url');
        addTypeForValidator('email');
        addTypeForValidator('creditCard');
        addTypeForValidator('timeString');
        addTypeForValidator('dateString');
        addTypeForValidator('hexColor');
        addTypeForValidator('ip');

        function addTypeForValidator(validatorName) {
            var validators = {};
            validators[validatorName] = {
                expression: is[validatorName],
                message: '"无效的 ' + validatorName + '"'
            };
            formlyConfig.setType({
                name: validatorName,
                defaultOptions: {
                    validators: validators
                }
            });
        }

        // 异步资源验证器
        formlyConfig.setType({
            name: "bizValidator",
            defaultOptions: {
                asyncValidators: {
                    ctrlCode:{
                        expression: function (viewValue, modelValue,scope) {
                            var defer = $q.defer();
                            var repository = scope.options.templateOptions.repository;
                            var repositoryParams = scope.options.templateOptions.repositoryParams || {};
                            if (!repository) {
                                defer.reject();
                            } else {
                                var params = {};
                                var reversal = scope.options.templateOptions.reversal;
                                if (scope.options.templateOptions.searchProp) {
                                    params[scope.options.templateOptions.searchProp] = viewValue;
                                }
                                params = angular.extend({},repositoryParams,params);
                                repository.post(params)
                                    .then(function(response) {
                                        var noExist = !response.data || response.data.length === 0;
                                        noExist = reversal?!noExist:noExist;
                                        if (noExist) {
                                            defer.reject();
                                        } else {
                                            defer.resolve();
                                        }
                                    },function(error) {
                                        defer.reject(error);
                                    });
                            }

                            return defer.promise;
                        },
                        message: '"无效的资源"+to.searchProp'
                    }
                },
                modelOptions:{ updateOn: 'blur' }
            }
        });
    });;/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly.wrapper-validation")
.config(function(formlyConfigProvider) {
        formlyConfigProvider.setWrapper({
            name: 'showErrorMessage',
            types: ['input', 'select', 'textarea','radio','checkbox','multiCheckbox'],
            template: [
                '<formly-transclude></formly-transclude>',
                '<div ng-messages="fc.$error" ng-if="form.$submitted || options.formControl.$touched" class="error-messages">',
                '<div ng-message="{{ ::name }}" ng-repeat="(name, message) in ::options.validation.messages" class="message">{{ message(fc.$viewValue, fc.$modelValue, this)}}</div>',
                '</div>'
            ].join("")
        });
    });;angular.module('ui.neptune.tpls', ['/template/datatable/datatable-edit.html', '/template/datatable/datatable.html', '/template/form/form.html', '/template/formly/npt-select-image.html', '/template/formly/npt-select-tree-single.html', '/template/formly/ui-select.html', '/template/select-image/select-image-modal.html', '/template/select-image/select-image.html', '/template/select-tree/select-tree-modal.html', '/template/select-tree/select-tree.html']);

angular.module("/template/datatable/datatable-edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/template/datatable/datatable-edit.html",
    "<div><div class=\"modal-header\"><button type=\"button\" ng-click=\"vm.cancel()\" aria-label=\"关闭\" class=\"close\"><span>&times</span></button><h4 class=\"modal-title\">编辑</h4></div><div class=\"modal-body\"><formly-form model=\"vm.formData.model\" fields=\"vm.formData.fields\" form=\"vm.form\"></formly-form></div><div class=\"modal-footer\"><button type=\"button\" ng-click=\"vm.ok()\" class=\"btn btn-primary\">确定</button><button type=\"button\" ng-click=\"vm.cancel()\" class=\"btn btn-warning\">取消</button></div></div>");
}]);

angular.module("/template/datatable/datatable.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/template/datatable/datatable.html",
    "<div><div class=\"col-md-12\"><!-- 设置为响应式表格 当页面宽度不够显示表格内容时会出现滚动条--><div class=\"table-responsive\"><!-- table-striped表示隔行显示不同颜色条纹；table-hover鼠标悬停变色；table-bordered表格线框;table-condensed紧缩表格--><table class=\"table table-striped table-bordered table-hover table-condensed\"><tfoot><tr ng-show=\"isPagination\"><td colspan=\"50\"><uib-pagination style=\"margin:0px;\" total-items=\"datatable.page.totalItems\" ng-model=\"datatable.page.currPage\" items-per-page=\"datatable.page.itemsPerPage\" max-size=\"datatable.page.maxSize\" boundary-links=\"true\" first-text=\"首页\" previous-text=\"上一页\" next-text=\"下一页\" last-text=\"尾页\" class=\"pagination-sm\"></uib-pagination></td></tr></tfoot><thead><tr ng-show=\"isPagination\"><td colspan=\"50\"><uib-pagination style=\"margin:0px;\" total-items=\"datatable.page.totalItems\" ng-model=\"datatable.page.currPage\" items-per-page=\"datatable.page.itemsPerPage\" max-size=\"datatable.page.maxSize\" boundary-links=\"true\" first-text=\"首页\" previous-text=\"上一页\" next-text=\"下一页\" last-text=\"尾页\" class=\"pagination-sm\"></uib-pagination></td></tr><tr><th ng-if=\"datatable.page.isIndex\" class=\"text-center\">&#24207;&#21495;</th><th ng-repeat=\"item in datatable.header.items\" class=\"text-center\">{{item.label}}</th><th ng-if=\"datatable.action.items.length&gt;0\" class=\"text-center\">&#25805;&#20316;</th></tr></thead><tbody><tr ng-repeat=\"item in datatable.page.data\"><td ng-if=\"datatable.page.isIndex\" class=\"text-center\">{{($index+1)+(datatable.page.currPage * datatable.page.itemsPerPage - datatable.page.itemsPerPage)}}</td><td ng-repeat=\"headerItem in datatable.header.items\">{{item[headerItem.name]}}</td><td ng-if=\"datatable.action.items.length&gt;0\"><a ng-repeat=\"actionItem in datatable.action.items\" href=\"\" ng-click=\"datatable.action.onClick(actionItem,item,datatable.page.currPage * datatable.page.itemsPerPage - datatable.page.itemsPerPage + $parent.$index)\" class=\"btn btn-primary btn-xs\">{{actionItem.label}}</a></td></tr></tbody></table></div></div></div>");
}]);

angular.module("/template/form/form.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/template/form/form.html",
    "<div></div>");
}]);

angular.module("/template/formly/npt-select-image.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/template/formly/npt-select-image.html",
    "<div><div npt-select-image=\"to\"></div><div class=\"row\"><div class=\"col-md-12\"><button type=\"button\" ng-click=\"to.onSelect(model, options)\" class=\"btn btn-primary\">从相册选择</button></div></div><div class=\"row\"><div ng-repeat=\"image in to.selectedImages\" class=\"col-md-2\"><a href=\"\" class=\"thumbnail\"><img src=\"{{image.file.thumbnailUrl}}\"></a></div></div></div>");
}]);

angular.module("/template/formly/npt-select-tree-single.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/template/formly/npt-select-tree-single.html",
    "<div><div npt-select-tree=\"to\"></div><div class=\"input-group\"><input placeholder=\"{{to.placeholder}}\" type=\"text\" ng-model=\"to.viewvalue\" disabled class=\"form-control\"><input type=\"text\" ng-model=\"model[options.key]\" disabled ng-hide=\"true\" class=\"form-control\"><span class=\"input-group-btn\"><button type=\"button\" ng-click=\"to.onClickSelect(model,options)\" class=\"btn btn-primary\">选择</button></span></div></div>");
}]);

angular.module("/template/formly/ui-select.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/template/formly/ui-select.html",
    "<ui-select data-ng-model=\"model[options.key]\" data-required=\"{{to.required}}\" data-disabled=\"{{to.disabled}}\" theme=\"bootstrap\"><ui-select-match placeholder=\"{{to.placeholder}}\" data-allow-clear=\"true\">{{$select.selected[to.labelProp]}}</ui-select-match><ui-select-choices data-repeat=\"{{to.ngOptions}}\" data-refresh=\"to.refresh($select.search,model, options)\" data-refresh-delay=\"{{to.refreshDelay}}\"><div ng-bind-html=\"option[to.labelProp] | highlight: $select.search\"></div><small><span ng-bind-html=\"''+option[to.smallLabelProp] | highlight: $select.search\"></span></small></ui-select-choices></ui-select>");
}]);

angular.module("/template/select-image/select-image-modal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/template/select-image/select-image-modal.html",
    "<div><div class=\"modal-header\"><button type=\"button\" ng-click=\"vm.cancel()\" aria-label=\"关闭\" class=\"close\"><span>&times</span></button><h4 class=\"modal-title\">选择</h4><p ng-show=\"vm.refresh.$$state.status === 0\">正在加载数据,请稍后...</p></div><div class=\"modal-body\"><div class=\"row\"><div class=\"col-md-12\"><p>已经选择了{{vm.selectNum}}张图片.</p></div></div><div ng-repeat=\"rows in vm.images\" class=\"row\"><div ng-repeat=\"image in rows\" class=\"col-md-3\"><a href=\"\" ng-click=\"vm.selectImage(image)\" class=\"thumbnail\"><span style=\"position:absolute;right:25px;top:5px;\" ng-show=\"image.selected\" class=\"glyphicon glyphicon-ok bg-primary\"></span><img src=\"{{image.file.thumbnailUrl}}\"></a></div></div></div><div class=\"modal-footer\"><button type=\"button\" ng-click=\"vm.ok()\" class=\"btn btn-primary\">确定</button><button type=\"button\" ng-click=\"vm.cancel()\" class=\"btn btn-warning\">取消</button></div></div>");
}]);

angular.module("/template/select-image/select-image.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/template/select-image/select-image.html",
    "<div><div class=\"row\"></div></div>");
}]);

angular.module("/template/select-tree/select-tree-modal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/template/select-tree/select-tree-modal.html",
    "<div><div class=\"modal-header\"><button type=\"button\" ng-click=\"vm.cancel()\" aria-label=\"关闭\" class=\"close\"><span>&times</span></button><h4 class=\"modal-title\">选择</h4></div><div class=\"modal-body\"><div class=\"row\"><div class=\"col-md-12\"><p ng-show=\"vm.refresh.$$state.status === 0\">正在加载数据,请稍后...</p><p ng-show=\"vm.refresh.$$state.status !== 0\">&nbsp</p></div></div><div class=\"row\"><div class=\"col-md-4\"><div ui-tree id=\"tree-root\" data-drag-enabled=\"false\"><ol ui-tree-nodes ng-model=\"vm.treeData\"><li ng-repeat=\"node in vm.treeData\" ui-tree-node ng-include=\"'org_nodes.html'\"></li></ol></div></div><div class=\"col-md-8\"><div ui-grid=\"vm.gridOptions\" ui-grid-selection class=\"grid\"></div></div></div></div><div class=\"modal-footer\"><button type=\"button\" ng-click=\"vm.ok()\" class=\"btn btn-primary\">确定</button><button type=\"button\" ng-click=\"vm.cancel()\" class=\"btn btn-warning\">取消</button></div><script type=\"text/ng-template\" id=\"org_nodes.html\"><div ui-tree-handle class=\"tree-node tree-node-content\"><a ng-if=\"node.nodes &amp;&amp; node.nodes.length &gt; 0\" ng-click=\"toggle(this)\" class=\"btn btn-success btn-xs\"><span ng-class=\"{'glyphicon-chevron-right': collapsed,'glyphicon-chevron-down': !collapsed}\" class=\"glyphicon\"></span></a>&nbsp &nbsp<a ng-click=\"vm.onTreeClick(node)\" class=\"btn-link\">{{node.title}}</a></div><ol ui-tree-nodes=\"\" ng-model=\"node.nodes\" ng-class=\"{hidden:collapsed}\"><li ng-repeat=\"node in node.nodes\" ui-tree-node ng-include=\"'org_nodes.html'\"></li></ol></script></div>");
}]);

angular.module("/template/select-tree/select-tree.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("/template/select-tree/select-tree.html",
    "<div></div>");
}]);
