/**
 * Created by leon on 15/11/2.
 */

angular.module("bizModule", [])
    .provider("bizModuleConfig", function () {
        this.configs = {};

        this.reg = function (name, module) {

            if (!module) {
                module = name;
                name = module.name;
            }

            if (!name) {
                throw new Error("must have name.");
            }

            this.configs[name] = module;

            return this;
        };

        this.$get = function () {
            var self = this;
            var service = {
                getModuleConfig: function (name) {
                    return self.configs[name];
                }
            };
            return service;
        };
    });