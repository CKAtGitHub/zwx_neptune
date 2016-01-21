/**
 * Created by leon on 15/11/16.
 */

angular.module("formly.npt.select.image.demo", ["ui.neptune"])
    .factory("QueryImageByUserLevel", function (nptRepository) {

        return nptRepository("QueryFile").params({
            "userid": "186",
            "level": "user",
            "instid": "10000001463017",
            "filetype": "image"
        }).addRequestInterceptor(function (request) {
            return request;
        });
    })
    .controller("FormlyNptSelectImageDemoController", function (QueryImageByUserLevel,AddOrUpdateFileRepo,$http) {
        var vm = this;

        vm.onSubmit = function () {
            if (vm.form.$valid) {
                vm.options.updateInitialValue();
                alert(JSON.stringify(vm.model), null, 2);
            }
        };
        vm.options = {};
        //vm.model = {selectImage:["10000001549030","10000001526186"]};
        vm.model = {selectImage:"123"};
        vm.fields = [
            {
                key: 'selectImage',
                type: 'npt-select-image',
                templateOptions: {
                    label: "选择图片",
                    single: true,
                    required: true,
                    download:true,
                    editable:true,
                    disabled:false,
                    imageRepository: QueryImageByUserLevel,
                    uploadOptions: {
                        getSignature: function () {
                            return $http.get("/api/aliuploadAuth");
                        },
                        repository: AddOrUpdateFileRepo,
                        repositoryParams: {
                            "instid": "10000001463017",
                            "createby": "10000001519061"
                        }
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