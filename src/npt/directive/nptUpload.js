/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.directive.upload", [])
    .controller("UploadControllect",function($scope,uploadFactory) {
        var vm = this;
        vm.nptUpload = $scope.nptUpload;
        vm.model = $scope.model;

        vm.browse = function() {

        };

        vm.startUpload = function() {

        };

    }).factory("uploadFactory",function() {
        var policyText = {
            "expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
            "conditions": [
                ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
            ]
        };

        var accessid= '6MKOqxGiGU4AUk44';
        var accesskey= 'ufu7nS8kS59awNihtjSonMETLI0KLy';
        var host = 'http://post-test.oss-cn-hangzhou.aliyuncs.com';


        var policyBase64 = Base64.encode(JSON.stringify(policyText));
        var message = policyBase64;
        var bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, { asBytes: true }) ;
        var signature = Crypto.util.bytesToBase64(bytes);

        function set_upload_param(up)
        {
            var ret = true;//get_signature();通过服务器获取上传配置
            if (ret === true)
            {
                new_multipart_params = {
                    'Filename': '${filename}',
                    'key' : '${filename}',
                    'policy': policyBase64,
                    'OSSAccessKeyId': accessid,
                    'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
                    'signature': signature,
                };

                up.setOption({
                    'url': host,
                    'multipart_params': new_multipart_params
                });
            }
        }

        var uploader = new plupload.Uploader({
            runtimes : 'html5,flash,silverlight,html4',
            browse_button : 'selectfiles',
            container: document.getElementById('container'),
            flash_swf_url : '/vendor/plupload-2.1.2/js/Moxie.swf',
            silverlight_xap_url : '/vendor/plupload-2.1.2/js/Moxie.xap',

            url : host,

            init: {
                PostInit: function() {
                    document.getElementById('ossfile').innerHTML = '';
                    document.getElementById('postfiles').onclick = function() {
                        set_upload_param(uploader);
                        uploader.start();
                        return false;
                    };
                },

                FilesAdded: function(up, files) {
                    plupload.each(files, function(file) {
                        document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>' +
                            '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>' +
                            '</div>';
                    });
                },

                UploadProgress: function(up, file) {
                    var d = document.getElementById(file.id);
                    d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";

                    var prog = d.getElementsByTagName('div')[0];
                    var progBar = prog.getElementsByTagName('div')[0];
                    progBar.style.width= 2*file.percent+'px';
                    progBar.setAttribute('aria-valuenow', file.percent);
                },

                FileUploaded: function(up, file, info) {
                    console.log('uploaded');
                    console.log(info.status);
                    set_upload_param(up);
                    if (info.status >= 200 || info.status < 200)
                    {
                        document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'success';
                    }
                    else
                    {
                        document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                    }
                },

                Error: function(up, err) {
                    set_upload_param(up);
                    document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
                }
            }
        });

        uploader.init();
        return uploader;
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
                nptUpload: "=",
                model: "="
            },
            link: function () {
            }
        };
    }]);
