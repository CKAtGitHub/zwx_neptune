/**
 * Created by leon on 15/11/16.
 */

angular.module("SelectImageDemo", ["ui.neptune"])
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
    .controller("SelectImageDemoController", function ($log, QueryImageByUserLevel) {

        var vm = this;

        vm.selectImageOptions = {
            imageRepository: QueryImageByUserLevel,
            onRegisterApi: function (selectImageApi) {
                vm.selectImageApi = selectImageApi;
            }
        }

        vm.open = function () {
            if (vm.selectImageApi) {
                vm.selectImageApi.open().then(function (response) {
                    $log.info("用户选择了图片", response);
                }, function (error) {
                    $log.info("取消选择", error);
                });
            }
        }
    });