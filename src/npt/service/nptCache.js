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

    });