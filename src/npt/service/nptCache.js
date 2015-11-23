/**
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
        };
    }).filter('ctrlCodeFilter', function (nptCache) {
        return function (input, key, labelProp, valueProp) {
            if (!input || !key || !labelProp || !valueProp) { // 如果值为空，或者没有指定
                return input;
            }
            var ctrlCodeData = nptCache.get("ctrlcode");
            if (!ctrlCodeData) {
                return;
            }
            var datas = ctrlCodeData[key];
            if (datas) {
                var output;
                angular.forEach(datas,function(data) {
                    if (data[valueProp] == input) {
                        output = data[labelProp];
                    }
                });
                return output;
            }
        };
    });