/**
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
    });