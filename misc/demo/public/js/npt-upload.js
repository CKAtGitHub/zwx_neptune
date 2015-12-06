/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("nptUploadApp", ["ui.neptune"])
    .controller("nptUploadDemoController", function ($scope, $http, AddOrUpdateFileRepo) {
        var vm = this;

        vm.uploadOptions = {
            up: {
                filters: {
                    mime_types: [
                        {title: "Image File", extensions: "jpg,gif,png"}
                    ],
                    max_file_size: '100kb'
                }
            },
            getSignature: function () {
                return $http.get("/api/aliuploadAuth");
            },
            filesAdded: function (files) {

            },
            fileUploaded: function (file, info) {
                console.log("文件上传成功：" + file.UUID);
            },
            repository: AddOrUpdateFileRepo,
            repositoryParams: {
                "instid": "10000001463017",
                "sn": "111111111111",
                "name": "22222",
                "type": "jpg",
                "storagetype": "aliyun",
                "bucket": "aliyun",
                "level": "system",
                "filetype": "image",
                "createby": "10000001519061"
            }
        };
    }).factory("AddOrUpdateFileRepo", function (nptRepository) {
        return nptRepository("AddOrUpdateFile");
    });
