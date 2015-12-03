/**
 * Created by leon on 15/11/16.
 */


angular.module("ui.neptune.formly.select-tree-single", [], function config(formlyConfigProvider) {
    formlyConfigProvider.setType({
        name: "npt-select-tree-single",
        templateUrl: "/template/formly/npt-select-tree-single.html",
        extends: 'input',
        defaultOptions: {
            wrapper:["showErrorMessage"],
            controller: function ($scope, $log, $injector) {
                var options = $scope.options;
                var to = options.templateOptions;

                //监听数据,如果发生变化重新检索远程显示值
                $scope.$watch("model." + options.key, function (newValue, oldValue) {
                    if (newValue && to.viewvalueRepository) {
                        if (angular.isFunction(to.viewvalueRepository)) {
                            to.viewvalue = $injector.invoke(to.viewvalueRepository);
                        } else {
                            var params = {};
                            params[to.viewvalueQueryProp] = newValue;
                            to.viewvalueRepository.post(params).then(function (response) {
                                to.viewvalue = response.data[to.viewvalueProp];
                            }, function (error) {
                                //发生错误清空模型数据
                                $scope.model[options.key] = undefined;
                            });
                        }
                    } else {
                        to.viewvalue = newValue;
                    }
                });

            },
            templateOptions: {
                label: "请选择:",
                placeholder: "请选择.",
                valueProp: 'id',
                labelProp: 'name',
                viewvalueQueryProp: "id",
                viewvalueProp: "name",
                viewvalue: undefined,
                onClickSelect: function (modal, options) {
                    var self = this;

                    self.selectTreeApi.open().then(function (response) {
                        if (response && response.length > 0) {
                            modal[options.key] = response[0][self.valueProp];
                            self.viewvalue = response[0][self.labelProp];
                        }
                    }, function () {
                    });
                },
                onRegisterApi: function (selectTreeApi) {
                    this.selectTreeApi = selectTreeApi;
                },
                treeRepository: undefined,
                listRepository: undefined,
                viewvalueRepository: undefined
            }
        }
    });
});