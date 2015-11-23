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
    .controller("SelectImageDemoController", function ($log, QueryImageByUserLevel,nptCache) {

        var vm = this;

        vm.selected = [];

        vm.selectImageOptions = {
            imageRepository: QueryImageByUserLevel,
            onRegisterApi: function (selectImageApi) {
                vm.selectImageApi = selectImageApi;
            },
            single: true
        };

        vm.imageOptions = {
            repository:QueryImageByUserLevel.addResponseInterceptor(function(response) {
                if (response.data) {
                    response.data.forEach(function(item) {
                        var file = nptCache.get("file", item.id);
                        if (file) {
                            item.thumbnailUrl = file.thumbnailUrl;
                        }
                    });
                }
                return response;
            }),
            searchProp:"id",
            labelProp:"thumbnailUrl",
            class:"col-md-2 thumbnail",
            emptyImage:"https://placeholdit.imgix.net/~text?txtsize=33&txt=350%C3%97150&w=350&h=150",
            errorImage:"https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/logo_white_fe6da1ec.png"
        };

        vm.open = function () {
            if (vm.selectImageApi) {
                vm.selectImageApi.open().then(function (response) {
                    $log.info("用户选择了图片", response);
                    vm.selected = response;
                }, function (error) {
                    $log.info("取消选择", error);
                });
            }
        }
    });