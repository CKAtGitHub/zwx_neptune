/**
 * Created by leon on 15/11/9.
 */

angular.module('formlyExample', ['ui.neptune'])
    .controller("formlyExampleController", function ($scope,$http, AddOrUpdateFileRepo) {
        var vm = this;

        vm.onSubmit = function onSubmit() {
            if (vm.form.$valid) {
                vm.options.updateInitialValue();
                alert(JSON.stringify(vm.model), null, 2);
            }
        };
        vm.model = {};
        vm.fields = [
            {
                key: 'number1',
                type: 'npt-formly-upload',
                templateOptions: {
                    label: '头像',
                    required: true,
                    up: {
                        filters: {
                            mime_types: [
                                {title: "Image File", extensions: "jpg,gif,png"}
                            ],
                            max_file_size: '100kb'
                        },
                        multi_selection: false
                    },
                    getSignature: function () {
                        return $http.get("/api/aliuploadAuth");
                    },
                    repository: AddOrUpdateFileRepo,
                    repositoryParams: {
                        "instid": "10000001463017",
                        "storagetype": "aliyun",
                        "bucket": "aliyun",
                        "level": "system",
                        "filetype": "image",
                        "createby": "10000001519061"
                    }
                }
            }
        ];
        vm.originalFields = angular.copy(vm.fields);
    }).factory("AddOrUpdateFileRepo", function (nptRepository, nptSessionManager) {
        return nptRepository("AddOrUpdateFile").addRequestInterceptor(function (request) {
            //request.params.createby = nptSessionManager.getSession.getUser().id;
            //request.params.instid = nptSessionManager.getSession.getInst().id;
            return request;
        });
    });