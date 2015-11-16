/*!
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
                message: '"Invalid ' + validatorName + '"'
            };
            formlyConfig.setType({
                name: validatorName,
                defaultOptions: {
                    validators: validators
                }
            });
        }

        // 验证控制编码
        formlyConfig.setType({
            name: "ctrlCode",
            defaultOptions: {
                asyncValidators: {
                    ctrlCode:{
                        expression: function (viewValue, modelValue,scope) {
                            var defer = $q.defer();
                            if (!scope.options.templateOptions.defNo) {
                                defer.reject();
                            } else {
                                QueryCtrlCode.post({defno:scope.options.templateOptions.defNo,no:viewValue})
                                    .then(function(response) {
                                        if (!response.data || response.data.length === 0) {
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
                        message: '"无效的控制编码"'
                    }
                },
                modelOptions:{ updateOn: 'blur' }
            }
        });
    })
    .factory("QueryCtrlCode", function (nptRepository) {
        return nptRepository("QueryMdCtrlcode");
    });