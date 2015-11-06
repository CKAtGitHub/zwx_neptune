/**
 * Created by leon on 15/11/6.
 */

angular.module("ui.neptune.service.model", [])
    .provider("Model", function () {
        this.models = {};

        /**
         * 注册一个模型,可以链式调用
         * @param name
         * @param model
         * @returns {*}
         */
        this.model = function (name, model) {
            if (!model) {
                model = name;
                name = model.name;
            }

            if (!name) {
                throw new Error("module must have a name.");
            }
            this.models[name] = model;
            return this;
        };

        this.$get = function () {
            var self = this;
            var service = {
                /**
                 * 根据名称获取模型.
                 * @param name
                 * @param done
                 */
                model: function (name, done) {
                    if (name && done) {
                        done(self.models[name]);
                    }
                }
            };
            return service;
        };
    });