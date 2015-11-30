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
    .controller("FormlyNptSelectImageDemoController", function (QueryImageByUserLevel) {
        var vm = this;

        vm.onSubmit = function () {
            if (vm.form.$valid) {
                vm.options.updateInitialValue();
                alert(JSON.stringify(vm.model), null, 2);
            }
        };
        vm.options = {};
        vm.model = {selectImage:["10000001549030","10000001526186"]};
        vm.fields = [
            {
                key: 'selectImage',
                type: 'npt-select-image',
                templateOptions: {
                    label: "选择图片",
                    single:true,
                    imageRepository: QueryImageByUserLevel
                }
            }
        ];

        vm.originalFields = angular.copy(vm.fields);
    });