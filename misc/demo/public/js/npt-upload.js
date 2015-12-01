/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("nptUploadApp", ["ui.neptune"])
    .controller("nptUploadDemoController", function ($scope) {
        var vm = this;

        vm.uploadOptions = {
            up: {
                filters: {
                    mime_types: [
                        {title: "Image File", extensions: "jpg,gif,png"}
                    ],
                    max_file_size: '100kb'
                }
            }
        };
    });
