/**
 * Created by leon on 15/11/16.
 */

angular.module("formly.npt.select.file.demo", ["ui.neptune"])
    .factory("QueryImageByUserLevel", function (nptRepository) {

        return nptRepository("QueryFile").params({
            "userid": "186",
            "level": "user",
            "instid": "10000001463017",
            "filetype": "doc"
        }).addRequestInterceptor(function (request) {
            return request;
        });
    })
    .controller("FormlyNptSelectFileDemoController", function (QueryImageByUserLevel,AddOrUpdateFileRepo,$http) {
        var vm = this;

        vm.onSubmit = function () {
            if (vm.form.$valid) {
                vm.options.updateInitialValue();
                alert(JSON.stringify(vm.model), null, 2);
            }
        };
        vm.options = {};
        //vm.model = {selectImage:["10000001549030","10000001526186"]};
        vm.model = {selectFile:"10000002883852"};
        vm.fields = [
            {
                key: 'selectFile',
                type: 'npt-select-file',
                templateOptions: {
                    label: "选择文件",
                    single: false,
                    required: true,
                    fileRepository: QueryImageByUserLevel,
                    uploadOptions: {
                        getSignature: function () {
                            return $http.get("/api/aliuploadAuth");
                        },
                        repository: AddOrUpdateFileRepo,
                        repositoryParams: {
                            "instid": "10000001463017",
                            "createby": "10000001519061",
                            "filetype":"doc"
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