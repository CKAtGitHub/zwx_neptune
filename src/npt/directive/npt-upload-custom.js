/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.directive.npt-upload-custom", [])
    .controller("UploadCustomControllect", function ($scope, $q, nptMessageBox, $timeout) {
        var vm = this;
        vm.options = $scope.nptUploadCustom || {};
        var bigDefer;
        vm.isUploadDoc = angular.isDefined(vm.options.uploadDoc) ? vm.options.uploadDoc : true;
        vm.isUploadImage = angular.isDefined(vm.options.uploadImage) ? vm.options.uploadImage : true;
        vm.isUploadOther = angular.isDefined(vm.options.uploadOther) ? vm.options.uploadOther : false;

        vm.theFileType = vm.options.fileType;
        if (vm.options.fileType) {
            if (vm.options.fileType == "image") {
                vm.isUploadImage = true;
                vm.isUploadDoc = false;
            } else if (vm.options.fileType == "doc") {
                vm.isUploadImage = false;
                vm.isUploadDoc = true;
            } else {
                vm.isUploadOther = true;
                vm.isUploadImage = false;
                vm.isUploadDoc = true;
            }
        }

        var _templateOptions = {
            image: {
                filters: {
                    mime_types: [
                        {title: "Image File", extensions: "jpg,gif,png"}
                    ],
                    max_file_size: '10M'
                },
                multi_selection: true
            },
            doc: {
                filters: {
                    mime_types: [
                        {title: "Doc File", extensions: "doc,xls,docx,xlsx,pdf,txt,wps"}
                    ],
                    max_file_size: '10M'
                },
                multi_selection: true
            }
        };

        function mergeOptions(tempOptions, customOptions) {
            tempOptions = angular.copy(tempOptions || {});
            customOptions = angular.copy(customOptions || {});

            if (customOptions.fileExtensions) {
                tempOptions.filters = tempOptions.filters || {};
                tempOptions.filters.mime_types = tempOptions.filters.mime_types || [];
                if (tempOptions.filters.mime_types.length === 0) {
                    tempOptions.filters.mime_types[0] = {};
                }
                tempOptions.filters.mime_types[0].extensions = customOptions.fileExtensions;
            }

            if (customOptions.maxFileSize) {
                tempOptions.filters = tempOptions.filters || {};
                tempOptions.filters.max_file_size = customOptions.maxFileSize;
            }

            if (angular.isDefined(customOptions.multiSelection)) {
                tempOptions.multi_selection = customOptions.multiSelection;
            }

            return tempOptions;
        }

        function openModal(title, options) {
            bigDefer = $q.defer();
            var uploadOptions = {
                up: options || {},
                getSignature: vm.options.getSignature,
                showUploadBtn: false,
                filesAdded: function (files) {
                    //console.log("添加了文件");
                },
                fileUploaded: function (file, info) {
                    //console.log("文件上传成功：" + file.UUID);
                },
                uploadProgress : function(file) {
                    vm.messageBox.updateScope("isUploading",true);
                },
                uploadComplete: function (files) {
                    var filesSns = [];
                    angular.forEach(files, function (f) {
                        if (f.UUID) {
                            filesSns.push(f);
                        }
                    });
                    addFiles(filesSns).then(function (datas) {
                        $timeout(function () {
                            vm.uploaderApi.uploader.destroy();
                            vm.messageBox.uibModal().dismiss();
                        }, 300);
                        if (vm.onSuccess) {
                            vm.onSuccess(datas);
                        }
                    },function(error) {
                        if (vm.onFail) {
                            vm.onFail(error);
                        }
                    });
                },
                onRegisterApi: function (api) {
                    vm.uploaderApi = api;
                }
            };
            vm.messageBox = nptMessageBox.open({
                title: title,
                content: "<div npt-upload='$$ms.uploadOptions'></div>",
                scope: {
                    uploadOptions: uploadOptions,
                    isUploading:false
                },
                modal: {
                    backdrop: 'static'
                },
                action: {
                    success: {
                        label: "开始上传",
                        ngDisabled:"$$ms.isUploading",
                        listens: [function (modalResult) {
                            var defer = $q.defer();
                            vm.uploaderApi.uploader.startUpload();
                            defer.reject();
                            return defer.promise;
                        }]
                    },
                    cancel: {
                        label: "取消",
                        ngDisabled:"$$ms.isUploading",
                        listens: [function (modalResult) {
                            vm.uploaderApi.uploader.destroy();
                        }]
                    }
                }
            });
        }

        function addFiles(files) {
            var defer = $q.defer();
            var promise = defer.promise;
            if (!vm.options.repository) {
                defer.resolve(files);
                return promise;
            }
            function addFile(file) {
                var _baseParams = {
                    "storagetype": "aliyun",
                    "bucket": "aliyun",
                    "level": "user",
                    "filetype": vm.theFileType?vm.theFileType:(vm.isUploadImage?"image":"doc")
                };
                var params = angular.extend({}, _baseParams, vm.options.repositoryParams || {});
                params.sn = file.UUID;
                params.name = file.name;
                params.type = file.type;
                return vm.options.repository.post(params);

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
                defer.resolve(datas);
                bigDefer.resolve(datas);
            }, function (error) {
                defer.reject(error);
                bigDefer.reject(error);
            });
            return promise;
        }

        /*上传图片*/
        vm.uploadImage = function (title,options) {
            vm.theFileType = "image";
            var theOptions = mergeOptions(_templateOptions.image, angular.extend({},vm.options,options || {}));
            openModal(title || "上传图片", theOptions);
            return bigDefer.promise;
        };

        /*上传文件*/
        vm.uploadDoc = function (title,options) {
            vm.theFileType = "doc";
            var theOptions = mergeOptions(_templateOptions.doc, angular.extend({},vm.options,options || {}));
            openModal(title || "上传文档", theOptions);
            return bigDefer.promise;

        };

        /*上传其他*/
        vm.uploadOther = function (title,options) {
            vm.theFileType = "doc";
            var theOptions = mergeOptions(vm.options.otherUpload,angular.extend({},vm.options,options || {}));
            openModal(title || "上传文件", theOptions);
            return bigDefer.promise;
        };

        if (vm.options.onRegisterApi) {
            vm.options.onRegisterApi({
                onComplete: function(success,fail) {
                    vm.onSuccess = success;
                    vm.onFail = fail;
                },
                uploadOther: vm.uploadOther,
                uploadDoc: vm.uploadDoc,
                uploadImage: vm.uploadImage
            });
        }

    })
    .directive("nptUploadCustom", [function ($scope, $q, nptMessageBox) {
        return {
            restrict: "EA",
            controller: "UploadCustomControllect as vm",
            replace: true,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/upload/npt-upload-custom.html";
            },
            scope: {
                nptUploadCustom: "="
            },
            link: function () {
            }
        };
    }]);