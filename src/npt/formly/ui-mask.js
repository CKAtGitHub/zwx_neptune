/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly.ui-mask")
    .run(function (formlyConfig) {
        /*使用UI-MASK插件，由使用者自定义值格式*/
        formlyConfig.setType({
            name: 'maskedInput',
            extends: 'input',
            defaultOptions: {
                ngModelAttrs: {
                    mask: {
                        attribute: 'ui-mask'
                    },
                    maskPlaceholder: {
                        attribute: 'ui-mask-placeholder'
                    },
                    maskPlaceholderChar: {
                        attribute:'ui-mask-placeholder-char'
                    }
                },
                templateOptions: {
                    maskPlaceholder: ''
                }
            }
        });
        /*规定数字类型格式*/
        formlyConfig.setType({
            name: 'numberInput',
            extends: 'input',
            defaultOptions: {
                ngModelAttrs: {
                    numberMask: {
                        attribute: 'ui-number-mask'
                    },
                    negativeNumber: {
                        attribute: 'ui-negative-number'
                    },
                    min: {
                        attribute:'min'
                    },
                    max: {
                        attribute:'max'
                    }
                },
                templateOptions: {
                    numberMask: '2',
                    negativeNumber:''
                }
            }
        });

        /*规定时间戳类型格式*/
        formlyConfig.setType({
            name: 'dateInput',
            extends: 'input',
            defaultOptions: {
                ngModelAttrs: {
                    dataMask: {
                        attribute: 'ui-date-mask'
                    }
                },
                templateOptions: {
                    dataMask: ''
                }
            }
        });
    });