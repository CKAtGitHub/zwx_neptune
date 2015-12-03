/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly.messages")
    .run(function (formlyValidationMessages) {
        formlyValidationMessages.addTemplateOptionValueMessage('maxlength', 'maxlength', '长度过长', '', '长度过长');
        formlyValidationMessages.addTemplateOptionValueMessage('minlength', 'minlength', '长度太短', '', '长度太短');
        formlyValidationMessages.messages.required = 'to.label + " 为必填项"';
        formlyValidationMessages.messages.min = '"小于最小值："+to.min';
        formlyValidationMessages.messages.max = '"大于最大值："+to.max';
        formlyValidationMessages.messages.mask = '"不符合格式："+to.mask';
        formlyValidationMessages.messages.dateMask = '"不是有效的时间"';
    });