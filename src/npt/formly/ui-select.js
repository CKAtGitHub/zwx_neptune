/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly.ui-select")
    .run(function (formlyConfig, $q,$filter) {
        formlyConfig.setType({
            name: 'ui-select',
            extends: 'select',
            templateUrl: "/template/formly/ui-select.html",
            defaultOptions: {
                wrapper:["showErrorMessage"],
                ngModelAttrs: {
                    multiple: {
                        attribute: 'multiple'
                    }
                },
                templateOptions: {
                    ngOptions: 'option[to.valueProp] as option in to.options | filterBy:[to.valueProp,to.labelProp]: $select.search',
                    refresh: function refresh(value, model, field) {
                        //刷新逻辑
                        //1 如果存在search和repository,表示根据输入内容动态检索
                        //2 如果存在options,表示使用静态选择
                        //3 如果存在repository,表示单次检索资源
                        //4 其他情况返回空数据

                        var valueProp = field.templateOptions.valueProp;
                        var labelProp = field.templateOptions.labelProp;

                        //默认空内容
                        var promise = $q.when({
                            data: []
                        });


                        var searchFields = angular.copy(field.templateOptions.search || []);
                        var searchValue = value;

                        if (field.templateOptions.search && field.templateOptions.repository) {
                            //存在search以及repository,表示按输入条件检索
                            //model[field.key];
                            //此处会有一个暂时不好解决的问题.如果当前模型数据上有值,在首次刷新页面后,由于没有输入值,会导致此处不刷新后台数据,
                            //从而导致界面显示空,但是实际有模型数据


                            if (!value && ! model[field.key]) { //viewValue跟modelValue都为空
                                return;
                            }

                            var filterBy = $filter("filterBy");
                            var params = angular.copy(field.templateOptions.repositoryParams,{});
                            var oldOptions = field.templateOptions.options || [];
                            if (value){
                                //检查到输入内容,检索数据
                                oldOptions = filterBy(field.templateOptions.options,[labelProp],value);
                                if (searchFields.length === 0) {
                                    searchFields.push(labelProp);
                                }
                                searchValue = value;
                            } else if (model[field.key]) {
                                //使用模型值,检索数据
                                oldOptions = filterBy(field.templateOptions.options,[valueProp],model[field.key]);
                                if (searchFields.length === 0) {
                                    searchFields.push(valueProp);
                                }
                                searchValue = model[field.key];
                            }

                            if (oldOptions.length > 0) {    // 用户输入或者model里面的值在现有的options中存在，不检索
                                promise = $q.when({
                                    data: oldOptions
                                });
                            } else {
                                searchFields.forEach(function(field) {
                                    params[field] = searchValue;
                                });
                                promise = field.templateOptions.repository.post(params);
                            }
                        } else if (field.templateOptions.options && field.templateOptions.options.length > 0) {
                            //存在options,使用静态选择
                            promise = $q.when({
                                data: field.templateOptions.options
                            });
                        } else if (field.templateOptions.repository) {
                            //存在repository表示,检索资源作为待选列表,只在首次检索
                            promise = field.templateOptions.repository.post(field.templateOptions.repositoryParams || {});
                        }

                        return promise.then(function (response) {
                            field.templateOptions.options = angular.isArray(response.data)?response.data:[response.data];
                        });
                    },
                    refreshDelay: 0
                }
            }
        });
    });