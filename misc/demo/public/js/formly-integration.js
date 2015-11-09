/**
 * Created by leon on 15/11/9.
 */

angular.module('formlyExample', ['formly', 'formlyBootstrap','ui.neptune', 'formModule',"angular.filter"])
    .controller("formlyExampleController", function (formModuleFactory,formlyExampleHelper) {
        var vm = this;

        this.onSubmit = function onSubmit() {
            vm.options.updateInitialValue();
            alert(JSON.stringify(vm.model), null, 2);
        };
        vm.loadingData = formModuleFactory.loadModule("order", "orderid").then(function (module) {
            vm.model = module.model;
            vm.fields = formlyExampleHelper.toFields(module.fields);
            vm.originalFields = angular.copy(vm.fields);
        });
    })
    .run(function (formlyConfig, formlyValidationMessages, $q,formlyExampleConfig) {

        formlyExampleConfig.addAsyncValidator("ipAddress",
            {
                expression: function (viewValue, modelValue) {
                    console.log(arguments.length + "...");
                    var deferd = $q.defer();
                    var value = modelValue || viewValue;
                    if (/(\d{1,3}\.){3}\d{1,3}/.test(value)) {
                        deferd.resolve();
                    } else {
                        deferd.reject();
                    }
                    return deferd.promise;
                },
                message: '$viewValue + " is not a valid IP Address"'
            });

        formlyValidationMessages.addStringMessage('required', '这个内容必须填写.');

        formlyConfig.setType({
            name: 'ipAddress',
            extends: 'input'
        });

    })
    .config(function(nptBizFilterProviderProvider,nptBizValidatorProviderProvider) {
        nptBizFilterProviderProvider.addConfig('orderFilterSnToName', {
            "bizName": "queryOrderList",
            "bizParams": {"instid": "10000001463017","userid": "10000001498059"},
            "chains":['limitTo: 5','pick:"ordersn=="+$value','pickup:"name"']
        });

        nptBizValidatorProviderProvider.addConfig('ordersnExist', {
            "bizName": "queryOrderList",
            "bizParams": {"userid": "10000001498059", "instid": "10000001463017"},
            "validator": "exist"
        });
    })
    .provider('formlyExampleConfig', function () {
        var config = {
            asyncValidators: {},
            validators: {}
        };
        this.addValidator = function (name, cnf) {
            config.validators[name] = cnf;
        };
        this.addAsyncValidator = function (name, cnf) {
            config.asyncValidators[name] = cnf;
        };
        this.$get = function () {
            return {
                getValidator: function (name) {
                    return config.validators[name];
                },
                getAsyncValidator: function (name) {
                    return config.asyncValidators[name];
                },
                addValidator:function (name, cnf) {
                    config.validators[name] = cnf;
                },
                addAsyncValidator:function (name, cnf) {
                    config.asyncValidators[name] = cnf;
                }
            }
        }
    }).
    factory('formlyExampleHelper',function(formlyExampleConfig) {
        var helper = {};

        helper.toFields = function (fields) {
            // 转换validator
            fields.forEach(function(field) {
                if (field.validators && angular.isString(field.validators)) {
                    field.validators = helper.toValidator(field.validators);
                }
                if (field.asyncValidators && angular.isString(field.asyncValidators)) {
                    field.asyncValidators = helper.toValidator(field.asyncValidators,true);
                }
            });
            return fields;
        };

        helper.toValidator = function (validators,isAsync) {
            validators = angular.isArray(validators)?validators:[validators];
            var vtors = {};
            angular.forEach(validators,function(vtor) {
                if (isAsync) {
                    vtors[vtor] = formlyExampleConfig.getAsyncValidator(vtor);
                } else {
                    vtors[vtor] = formlyExampleConfig.getValidator(vtor);
                }
            });
            return vtors;
        };
        return helper;
    });