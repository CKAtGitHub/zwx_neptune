/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly.ui-validation")
    .run(function (formlyConfig, is) {

        addTypeForValidator('boolean');
        addTypeForValidator('date');// Date
        addTypeForValidator('nan');// NaN
        addTypeForValidator('null');
        addTypeForValidator('number');
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
        addTypeForValidator('decimal');// 浮点数
        addTypeForValidator('integer');


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
    });