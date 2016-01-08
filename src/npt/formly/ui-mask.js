/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly.ui-mask")
    .run(function (formlyConfig, uiMaskDateFactory) {
        /*使用UI-MASK插件，由使用者自定义值格式*/
        formlyConfig.setType({
            name: 'maskedInput',
            extends: 'input',
            defaultOptions: {
                wrapper: ["showErrorMessage"],
                ngModelAttrs: {
                    mask: {
                        attribute: 'ui-mask'
                    },
                    maskPlaceholder: {
                        attribute: 'ui-mask-placeholder'
                    },
                    maskPlaceholderChar: {
                        attribute: 'ui-mask-placeholder-char'
                    }
                },
                templateOptions: {
                    maskPlaceholder: ''
                }
            }
        });

        /*使用UI-MASK插件，由使用者自定义值格式*/
        formlyConfig.setType({
            name: 'maskedPercentInput',
            extends: 'input',
            defaultOptions: {
                wrapper: ["showErrorMessage"],
                ngModelAttrs: {
                    percentMask: {
                        attribute: 'ui-percentage-mask'
                    }
                },
                templateOptions: {
                    percentMask: 0
                }
            }
        });

        /*规定数字类型格式*/
        formlyConfig.setType({
            name: 'numberInput',
            extends: 'input',
            defaultOptions: {
                wrapper: ["showErrorMessage"],
                ngModelAttrs: {
                    numberMask: {
                        attribute: 'ui-number-mask'
                    },
                    negativeNumber: {
                        attribute: 'ui-negative-number'
                    },
                    min: {
                        attribute: 'min'
                    },
                    max: {
                        attribute: 'max'
                    }
                },
                templateOptions: {
                    numberMask: '2',
                    negativeNumber: ''
                }
            }
        });

        /*规定时间戳类型格式*/
        formlyConfig.setType({
            name: 'dateInput',
            extends: 'input',
            defaultOptions: {
                wrapper: ["showErrorMessage"],
                ngModelAttrs: {
                    mask: {
                        attribute: 'ui-mask'
                    },
                    maskPlaceholder: {
                        attribute: 'ui-mask-placeholder'
                    },
                    maskPlaceholderChar: {
                        attribute: 'ui-mask-placeholder-char'
                    }
                },
                templateOptions: {
                    maskPlaceholder: ''
                },
                expressionProperties: {
                    'templateOptions.mask': 'to.formateType =="short"?"9999-99-99":"9999-99-99 99:99:99"'
                },
                parsers: [uiMaskDateFactory.parseToDate],
                formatters: [uiMaskDateFactory.formateToString]
            }
        });
    }).factory('uiMaskDateFactory', function ($filter) {
        var factory = {};

        factory.parseToDate = function (viewValue, modleValue, scope) {
            if (!viewValue) {
                return viewValue;
            }
            var date = new Date(scope.fc.$viewValue.replace(/-/, "/")).getTime();
            scope.fc.$setValidity('dateMask', !!date);
            return date || undefined;
        };
        factory.formateToString = function (viewValue, modleValue, scope) {
            if (!modleValue) {
                return modleValue;
            }
            if (angular.isNumber(modleValue)) {
                var dateFilter = $filter('date');
                var formateString =
                    scope.to.formateType == "short" ? "yyyy-MM-dd" : 'yyyy-MM-dd HH:mm:ss';
                var dateString = dateFilter(modleValue, formateString);
                return dateString || undefined;
            }
        };
        return factory;
    });