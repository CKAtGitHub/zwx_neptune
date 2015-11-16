/**
 * Created by leon on 15/11/16.
 */


angular.module("ui.neptune.formly.select-tree-single", [], function config(formlyConfigProvider) {
    formlyConfigProvider.setType({
        name: "npt-select-tree",
        templateUrl: "/template/formly/npt-select-tree-single.html",
        extends: 'input',
        defaultOptions: {
            templateOptions: {
                label: "请选择:",
                placeholder: "请选择.",
                selectProp: "id",
                onClickSelect: function (modal, options) {
                    var self = this;

                    self.selectTreeApi.open().then(function (response) {
                        if (response && response.length > 0) {
                            modal[options.key] = response[0][self.selectProp];
                        }
                    }, function () {
                    });
                },
                onRegisterApi: function (selectTreeApi) {
                    this.selectTreeApi = selectTreeApi;
                },
                treeRepository: undefined,
                listRepository: undefined
            }
        }
    });
});