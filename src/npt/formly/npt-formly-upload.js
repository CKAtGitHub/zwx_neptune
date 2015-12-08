/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly.npt-formly-upload")
    .config(function (formlyConfigProvider) {
        formlyConfigProvider.setType({
            name: "npt-formly-upload",
            templateUrl: "/template/formly/npt-formly-upload.html",
            extends: 'input',
            defaultOptions: {
                wrapper: ["showErrorMessage"],
                controller: function ($scope, $q, nptMessageBox) {
                    var vm = this;
                    var options = $scope.options;
                    var to = options.templateOptions;
                    var model = $scope.model;
                    var bigDefer = $q.defer();

                    vm.uploadOptions = {
                        up: to.up || {},
                        getSignature: to.getSignature,
                        filesAdded: function (files) {
                            //console.log("添加了文件");
                        },
                        fileUploaded: function (file, info) {
                            //console.log("文件上传成功：" + file.UUID);
                        },
                        uploadComplete: function (files) {
                            //console.log("所有文件上传成功");
                        },
                        onRegisterApi: function (api) {
                            vm.uploaderApi = api;
                        }
                    };

                    vm.onClickUpload = function () {
                        nptMessageBox.open({
                            title: to.label,
                            content: "<div npt-upload='$$ms.uploadOptions'></div>",
                            scope: {
                                uploadOptions: vm.uploadOptions
                            },
                            modal: {
                                backdrop: 'static'
                            },
                            action: {
                                success: {
                                    label: "确定",
                                    listens: [function (modalResult) {
                                        var upFiles = vm.uploaderApi.uploader.files;
                                        var files = [];
                                        angular.forEach(upFiles, function (file) {
                                            if (file.UUID) {
                                                files.push(file);
                                            }
                                        });
                                        addFiles(files);
                                        vm.uploaderApi.uploader.destroy();
                                    }]
                                },
                                cancel: {
                                    label: "取消",
                                    listens: [function (modalResult) {
                                        vm.uploaderApi.uploader.destroy();
                                    }]
                                }
                            }
                        });
                    };

                    function addFiles(files) {
                        if (!to.repository) {
                            return;
                        }
                        function addFile(file) {
                            var _baseParams = {
                                "storagetype": "aliyun",
                                "bucket": "aliyun",
                                "level": "user",
                                "filetype": "image"
                            };
                            var params = angular.extend({},_baseParams,to.repositoryParams || {});
                            params.sn = file.UUID;
                            params.name = file.name;
                            params.type = file.type;
                            return to.repository.post(params);

                        }
                        var promiseArr = [];
                        angular.forEach(files, function (sn) {
                            promiseArr.push(addFile(sn));
                        });
                        $q.all(promiseArr).then(function (responses) {
                            var datas = [];
                            angular.forEach(responses, function (resp) {
                                datas.push(resp.data);
                            });
                            showValue(datas);
                            bigDefer.resolve(datas);
                        }, function (error) {
                            bigDefer.reject(error);
                        });

                        function showValue(datas) {
                            var ids = [];
                            var names = [];
                            angular.forEach(datas, function (data) {
                                if (to.valueProp) {
                                    ids.push(data[to.valueProp]);
                                }
                                if (to.labelProp) {
                                    names.push(data[to.labelProp]);
                                }
                            });

                            if (ids.length === 0) {
                                ids = datas;
                                names = datas;
                            }

                            if (to.splitChar) {
                                vm.viewValue = names.join(to.splitChar);
                                model[options.key] = ids.join(to.splitChar);
                            } else {
                                model[options.key] = ids;
                                vm.viewValue = JSON.stringify(names);
                            }
                        }
                    }

                    if (to.onRegisterApi) {
                        to.onRegisterApi({
                            result: bigDefer.promise
                        });
                    }

                    $scope.vm = vm;
                },
                templateOptions: {
                    label: "请选择:",
                    placeholder: "请选择.",
                    disabled: true,
                    splitChar: ",",
                    valueProp: "id",
                    labelProp: "name",
                    uploadImage:true,
                    uploadDoc:true
                }
            }

        });
    })
    .controller("FormlyUploadControllect",function($scope, $q, nptMessageBox) {
        var vm = this;
        vm.options = $scope.nptFormlyUpload || {};
        vm.isUploadDoc = angular.isDefined(vm.options.uploadDoc)?vm.options.uploadDoc:true;
        vm.isUploadImage = angular.isDefined(vm.options.uploadImage)?vm.options.uploadImage:true;
        vm.isUploadOther = angular.isDefined(vm.options.uploadOther)?vm.options.uploadImage:false;

        var _templateOptions = {
            image:{
                filters: {
                    mime_types: [
                        {title: "Image File", extensions: "jpg,gif,png"}
                    ],
                    max_file_size: '10M'
                },
                multi_selection: true
            },
            doc:{
                filters: {
                    mime_types: [
                        {title: "Doc File", extensions: "doc,excel,docx,excelx,pdf,txt,wps"}
                    ],
                    max_file_size: '10M'
                },
                multi_selection: true
            }
        };

        function mergeOptions(tempOptions,customOptions) {

        }

        /*上传图片*/
        vm.uploadImage = function() {
            var theOptions = mergeOptions(_templateOptions.image);
        };

        /*上传文件*/
        vm.uploadDoc = function() {

        };

    })
    .directive("nptFormlyUpload", [function ($scope, $q, nptMessageBox) {
        return {
            restrict: "EA",
            controller: "FormlyUploadControllect as vm",
            replace: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/formly/npt-formly-upload-directive.html";
            },
            scope: {
                nptFormlyUpload: "="
            },
            link: function () {
            }
        };
    }]);