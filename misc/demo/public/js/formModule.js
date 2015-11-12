/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

'use strict';
angular.module('formModule', [])
    .factory('formModuleFactory', function ($q,$timeout,$sce) {

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

            return $timeout(function() {
                return [
                    {
                        "key": "firstName",
                        "type": "input",
                        ngModelAttrs: {
                            nptBizValidator: {
                                attribute: 'npt-biz-validator'
                            }
                        },
                        "templateOptions": {
                            "required": true,
                            "label": "订单编号：10000002322065",
                            "nptBizValidator":"ordersnExist"
                        }
                    },
                    {
                        "key": "lastName",
                        "type": "input",
                        ngModelAttrs: {
                            nptBizFilter: {
                                attribute: 'npt-biz-filter'
                            }
                        },
                        "templateOptions": {
                            "nptBizFilter": 'model["firstName"]|orderFilterSnToName',
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
                    },
                    {
                        "key":"choiceUser",
                        "type":"choiceAbleInput",
                        "templateOptions": {
                            nptChoiceByDialog:"order"
                        }
                    },
                    {
                        "key":"selectAddress",
                        "type":"ui-select",
                        templateOptions: {
                            label: '单选',
                            valueProp: 'id',
                            labelProp: 'name',
                            placeholder: 'Select option',
                            options: [],
                            datasource:"queryOrderList",
                            datasourceParams:{"userid": "10000001498059", "instid": "10000001463017"}
                        }
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