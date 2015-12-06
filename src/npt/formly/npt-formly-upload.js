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
                controller: function ($scope, $http,nptMessageBox) {
                    var vm = this;
                    var options = $scope.options;
                    var to = options.templateOptions;
                    var model = $scope.model;

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
                        uploadComplete : function(files) {

                        },
                        onRegisterApi: function (api) {
                            vm.uploaderApi = api;
                        }
                    };

                    vm.onClickUpload = function() {
                        nptMessageBox.open({
                            title:to.label,
                            content:"<div npt-upload='$$ms.uploadOptions'></div>",
                            scope:{
                                uploadOptions:vm.uploadOptions
                            },
                            action:{
                                success:{
                                    label:"确定",
                                    listens: [function (modalResult) {
                                        var upFiles = vm.uploaderApi.uploader.files;
                                        var files = [];
                                        var fileNames = [];
                                        angular.forEach(upFiles,function(file) {
                                            if (file.UUID) {
                                                fileNames.push(file.name);
                                                files.push(file);
                                            }
                                        });
                                        vm.viewValue = fileNames.join(";");
                                        model[options.key] = files;
                                        //$scope.$apply();
                                        vm.uploaderApi.uploader.destroy();
                                    }]
                                },
                                cancel:{
                                    label:"取消",
                                    listens: [function (modalResult) {
                                        vm.uploaderApi.uploader.destroy();
                                    }]
                                }
                            }
                        });
                    };

                    $scope.vm = vm;
                },
                templateOptions: {
                    label: "请选择:",
                    placeholder: "请选择.",
                    disabled: true
                }
            }

        });
    });