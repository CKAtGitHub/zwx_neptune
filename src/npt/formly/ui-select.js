/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly.ui-select")
    .run(function (formlyConfig, $q, $filter) {
        formlyConfig.setType({
            name: 'ui-select',
            extends: 'select',
            templateUrl: "/template/formly/ui-select.html",
            defaultOptions: {
                wrapper: ["showErrorMessage"],
                ngModelAttrs: {
                    multiple: {
                        attribute: 'multiple'
                    }
                },
                templateOptions: {
                    ngOptions: 'option[to.valueProp] as option in to.options | filterBy:[to.valueProp,to.labelProp]: $select.search',
                    refresh: function refresh(value, model, field, scope) {

                        var valueProp = field.templateOptions.valueProp;
                        var labelProp = field.templateOptions.labelProp;

                        //默认空内容
                        var promise = $q.when({
                            data: []
                        });

                        var searchFields = angular.copy(field.templateOptions.search || []);
                        var searchValue = value;
                        var keepModelValue = model[field.key];

                        field.templateOptions.placeholder = field.templateOptions.placeholder || "";

                        if (field.templateOptions.search && field.templateOptions.repository) {
                            //存在search以及repository,表示按输入条件检索
                            //model[field.key];
                            //此处会有一个暂时不好解决的问题.如果当前模型数据上有值,在首次刷新页面后,由于没有输入值,会导致此处不刷新后台数据,
                            //从而导致界面显示空,但是实际有模型数据


                            if (!value && !model[field.key]) { //viewValue跟modelValue都为空
                                // 监控model值的变化；
                                // 因为refresh仅在viewValue改变时触发
                                var theWatcher = scope.$watch("model." + field.key, function (nV, oV) {
                                    if (nV && field.formControl.$viewValue && field.formControl.$viewValue !== nV) {
                                        theWatcher();
                                        field.templateOptions.refresh(undefined, model, field, scope);
                                    }
                                });
                                return;
                            }

                            var filterBy = $filter("filterBy");
                            var params = angular.copy(field.templateOptions.repositoryParams, {});
                            var oldOptions = field.templateOptions.options || [];
                            if (value) {
                                //检查到输入内容,检索数据
                                oldOptions = filterBy(field.templateOptions.options, [labelProp], value);
                                if (searchFields.length === 0) {
                                    searchFields.push(labelProp);
                                }
                                searchValue = value;
                            } else if (model[field.key]) {
                                //使用模型值,检索数据
                                oldOptions = filterBy(field.templateOptions.options, [valueProp], model[field.key]);
                                if (searchFields.length === 0) {
                                    searchFields.push(valueProp);
                                }
                                searchValue = model[field.key];
                                model[field.key] = undefined;
                            }

                            if (oldOptions.length > 0) {    // 用户输入或者model里面的值在现有的options中存在，不检索
                                promise = $q.when({
                                    data: oldOptions
                                });
                            } else {
                                field.templateOptions.placeholder = field.templateOptions.placeholder + " (正在查询...)";
                                if (angular.isArray(searchValue)) {
                                    var promiseArr = [];
                                    angular.forEach(searchValue, function (sv) {
                                        promiseArr.push(function () {
                                            var pParams = angular.copy(params);
                                            searchFields.forEach(function (field) {
                                                pParams[field] = sv;
                                            });
                                            return field.templateOptions.repository.post(pParams);
                                        }());
                                    });
                                    promise = $q.all(promiseArr);
                                } else {
                                    searchFields.forEach(function (field) {
                                        params[field] = searchValue;
                                    });
                                    promise = field.templateOptions.repository.post(params);
                                }
                            }
                        } else if (field.templateOptions.options && field.templateOptions.options.length > 0) {
                            //存在options,使用静态选择
                            promise = $q.when({
                                data: field.templateOptions.options
                            });
                        } else if (field.templateOptions.repository) {
                            //存在repository表示,检索资源作为待选列表,只在首次检索
                            field.templateOptions.placeholder = field.templateOptions.placeholder + " (正在查询...)";
                            promise = field.templateOptions.repository.post(field.templateOptions.repositoryParams || {});
                        }

                        return promise.then(function (response) {
                            field.templateOptions.placeholder = field.templateOptions.placeholder.replace(" (正在查询...)", "");
                            model[field.key] = keepModelValue;
                            if (angular.isArray(response)) {
                                field.templateOptions.options = [];
                                angular.forEach(response, function (resp) {
                                    var dd = angular.isArray(resp.data) ? resp.data : [resp.data];
                                    dd.forEach(function (d) {
                                        field.templateOptions.options.push(d);
                                    });
                                });
                            } else {
                                field.templateOptions.options = angular.isArray(response.data) ? response.data : [response.data];
                            }

                            if (!model[field.key] && angular.isDefined(field.templateOptions.selectIndex) &&
                                field.templateOptions.options && field.templateOptions.options.length > 0 && !value) {
                                var indx = field.templateOptions.selectIndex;
                                if (field.templateOptions.multiple) {
                                    model[field.key] = [];
                                    model[field.key].push(field.templateOptions.options[indx][valueProp]);
                                } else {
                                    model[field.key] = field.templateOptions.options[indx][valueProp];
                                }
                            }

                        });
                    },
                    refreshDelay: 0
                }
            }
        });
    });