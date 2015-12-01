/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.directive.upload", [])
    .controller("UploadControllect", function ($scope, $http, $q) {
        var vm = this;
        vm.options = $scope.nptUpload;

        vm.filesInfo = [];
        vm.startUpload = function () {
            set_upload_param(uploader).then(function () {
                uploader.start();
            }, function (err) {
                console.error(err);
            });
        };

        var expire = 0;
        // 从服务器获取签名信息
        function get_signature() {
            //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
            var now = Date.parse(new Date()) / 1000;
            console.log('get_signature ...');
            console.log('expire:' + expire.toString());
            console.log('now:', +now.toString());
            if (expire < now + 3) {
                return $http.get("/api/aliuploadAuth");
            }
            return false;
        }

        function set_upload_param(up) {
            var deffer = $q.defer();
            var ret = get_signature();//通过服务器获取上传配置
            if (ret) {
                ret.then(function (response) {
                    var data = response.data;
                    expire = parseInt(data.expire);
                    new_multipart_params = {
                        'Filename': '${filename}',
                        'key': data.dir + '${filename}',
                        'policy': data.policy,
                        'OSSAccessKeyId': data.accessid,
                        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                        'signature': data.signature
                    };

                    up.setOption({
                        'url': data.host,
                        'multipart_params': new_multipart_params
                    });
                    deffer.resolve(data);
                }, function (err) {
                    deffer.reject(err);
                });
            } else {
                deffer.resolve();
            }
            return deffer.promise;
        }

        var uploader = new plupload.Uploader({
            runtimes: 'html5,flash,silverlight,html4',
            browse_button: 'selectfiles',
            container: document.getElementById('container'),
            flash_swf_url: '/vendor/plupload-2.1.2/js/Moxie.swf',
            silverlight_xap_url: '/vendor/plupload-2.1.2/js/Moxie.xap',
            url:'http://oss.aliyuncs.com',

            init: {
                PostInit: function () {
                    //document.getElementById('ossfile').innerHTML = '';
                },

                FilesAdded: function (up, files) {
                    plupload.each(files, function (file) {
                        file.formateSize = plupload.formatSize(file.size);
                        vm.filesInfo.push(file);
                    });
                    $scope.$apply();
                },

                UploadProgress: function (up, file) {
                    $scope.$apply();
                },

                FileUploaded: function (up, file, info) {
                    console.log('uploaded');
                    console.log(info.status);
                    set_upload_param(up);
                    if (info.status >= 200 || info.status < 200) {
                        file.uploadState = "success";
                    }
                    else {
                        file.uploadState = info.response;
                    }
                    $scope.$apply();
                },

                Error: function (up, err) {
                    set_upload_param(up);
                    console.error(err);
                }
            }
        });
        uploader.init();

    })
    .directive("nptUpload", [function () {
        return {
            restrict: "EA",
            controller: "UploadControllect as vm",
            replace: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/upload/upload.html";
            },
            scope: {
                nptUpload: "="
            },
            link: function () {
            }
        };
    }]);
