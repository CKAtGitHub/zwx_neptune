/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly.ui-select")
    .run(function (formlyConfig,$q,nptResource) {
        formlyConfig.setType({
            name: 'ui-select',
            extends: 'select',
            template: ['<ui-select data-ng-model="model[options.key]" data-required="{{to.required}}" data-disabled="{{to.disabled}}" theme="bootstrap">',
                '<ui-select-match placeholder="{{to.placeholder}}" data-allow-clear="true">{{$select.selected[to.labelProp]}}</ui-select-match>',
                '<ui-select-choices data-repeat="{{to.ngOptions}}" data-refresh="to.refresh($select.search,model, options)" data-refresh-delay="{{to.refreshDelay}}">',
                '<div ng-bind-html="option[to.labelProp] | highlight: $select.search"></div>',
                '<small>',
                '{{to.valueProp}}: <span ng-bind-html="\'\'+option[to.valueProp] | highlight: $select.search"></span>',
                '</small>',
                '</ui-select-choices>',
                '</ui-select>'].join(""),
            defaultOptions: {
                templateOptions: {
                    optionsAttr: 'bs-options',
                    ngOptions: 'option[to.valueProp] as option in to.options | filterBy:[to.valueProp,to.labelProp]: $select.search',
                    refresh: function refreshAddresses(input, model,field) {
                        function loadData(success, fail) {
                            var params = {};
                            if (field.templateOptions.searchProp) {
                                params[field.templateOptions.searchProp] = input;
                            }
                            params = angular.extend(field.templateOptions.datasourceParams || {}, params);
                            nptResource.post(field.templateOptions.datasource,
                                params,
                                success, fail);
                        }

                        var promise;
                        if (!field.templateOptions.datasource) {
                            promise = $q.when(field.templateOptions.options);
                        } else if (!field.templateOptions.options ||field.templateOptions.options.length===0 || field.templateOptions.searchProp) {
                            var defered = $q.defer();
                            promise = defered.promise;
                            loadData(function (data) {
                                defered.resolve(data);
                            }, function (error) {
                                defered.reject(error);
                            });
                        } else {
                            promise = $q.when(field.templateOptions.options);
                        }

                        return promise.then(function (arr) {
                            field.templateOptions.options = arr;
                        });
                    },
                    refreshDelay: 0
                }
            }
        });
    });