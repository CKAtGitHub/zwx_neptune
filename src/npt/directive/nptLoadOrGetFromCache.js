/*!
 * mars
 * Copyright(c) 2016 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.directive.nptLoadOrGetFromCache",[])
    .directive("nptLoadOrGetFromCache", function ($filter) {
        return {
            restrict: "EA",
            replace: false,
            template: "",
            link: function (scope, element, attrs, ctrl) {
                var DEFAULT_P_NAME = "nlogfc";

                // 设置结果
                function setupResult(entity,asKey) {
                    asKey = asKey || DEFAULT_P_NAME;
                    scope[asKey] = entity;
                }

                // 从服务中查询
                function queryRepository(options) {
                    var repository = options.repository;
                    var repositoryParams = options.repositoryParams || {};
                    var valueProp = options.valueProp;
                    var value = options.value;
                    var asKey = options.as;

                    if (!repository) {
                        return;
                    }

                    if (valueProp) {
                        repositoryParams[valueProp] = value;
                    }
                    repository.post(repositoryParams).then(function(resp) {
                        var data = resp.data;
                        data = angular.isArray(data)?data[0]:data;
                        setupResult(data,asKey);
                    });
                }

                /**
                 * options可用参数
                 * {
                 * value,值
                 * cache,缓存类型
                 * repository,服务查询接口
                 * repositoryParams,参数
                 * as 最终结果作为scope里的属性名称，默认：nlogfc
                 * }
                 */
                scope.$watchCollection(attrs.nptLoadOrGetFromCache,function(options){
                    options = options || {};
                    if (!options.value) {
                        setupResult(null,options.as);
                        return;
                    }
                    var value = options.value;
                    var cacheType = options.cache;
                    var repository = options.repository;
                    var asKey = options.as;

                    if (cacheType) {
                        var cacheFilter = $filter("cacheFilter");
                        var entity = cacheFilter(value,cacheType);
                        if (entity) {
                            setupResult(entity,asKey);
                        } else {
                            queryRepository(options);
                        }
                    } else if (repository) {
                        queryRepository(options);
                    }
                });
            }
        };
    });