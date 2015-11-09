/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

'use strict';
angular.module('formModule', [])
    .factory('formModuleFactory', function ($q,$timeout) {

        function FormModule(fileds,model) {
            this.fields = fileds;
            this.model = model||{};
        }

        var factory = {};

        factory.loadModule = function(moduleName,modelId) {
            var deferred = $q.defer();
            try {
                $q.all([this.loadFields(moduleName),this.loadModel(moduleName,modelId)])
                    .then(function(result) {
                        var module = new FormModule(result[0],result[1]);
                        deferred.resolve(module);
                    },function(error){
                        deferred.reject(error);
                    });
            }catch(e) {
                deferred.reject(e);
            }
            return deferred.promise;
        };

        factory.loadFields = function (moduleName) {

            function toUpperCase(value) {
                return (value || '').toUpperCase();
            }

            function toLowerCase(value) {
                return (value || '').toLowerCase();
            }

            return $timeout(function() {
                return [
                    {
                        "key": "firstName",
                        "type": "input",
                        "templateOptions": {
                            "required": true,
                            "label": "First Name"
                        }
                    },
                    {
                        "key": "lastName",
                        "type": "input",
                        "templateOptions": {
                            "label": "Last Name"
                        },
                        "expressionProperties": {
                            "templateOptions.disabled": "!model.firstName"
                        }
                    },
                    {
                        "key": "knowIpAddress",
                        "type": "checkbox",
                        "defaultValue":false,
                        "templateOptions": {
                            "label": "I know what an IP address is..."
                        }
                    },
                    {
                        "key": "ipAddress",
                        "type": "ipAddress",
                        "asyncValidators":"ipAddress",
                        "templateOptions": {
                            "label": "IP Address",
                            "placeholder": "127.0.0.1"
                        },
                        "hideExpression": "!model.knowIpAddress"
                    }
                ];
            },2000);
        };

        factory.loadModel = function (moduleName,id) {
            $timeout(function() {
                return {};
            },200);
        };
        return factory;
    })
    .config(function (formModuleConfigProvider) {
        formModuleConfigProvider.addConfig('order', {
            "bizName": "queryOrderList",
            "bizParams": {"userid": "10000001498059", "instid": "session.instid"}
        });
    })
    .provider('formModuleConfig', function () {
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
    });