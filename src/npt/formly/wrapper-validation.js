/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly.wrapper-validation")
.config(function(formlyConfigProvider) {
        formlyConfigProvider.setWrapper({
            name: 'showErrorMessage',
            types: ['input', 'select', 'textarea','radio','checkbox','multiCheckbox'],
            template: [
                '<formly-transclude></formly-transclude>',
                '<div ng-messages="fc.$error" ng-if="form.$submitted || options.formControl.$touched" class="npt-error-messages">',
                '<div ng-message="{{ ::name }}" ng-repeat="(name, message) in ::options.validation.messages" class="npt-message">{{ message(fc.$viewValue, fc.$modelValue, this)}}</div>',
                '</div>'
            ].join("")
        });
    });