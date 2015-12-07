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
                            var params = angular.copy(to.repositoryParams || {});
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
                            showValue(responses);
                            bigDefer.resolve(responses);
                        }, function (error) {
                            bigDefer.reject(error);
                        });

                        function showValue(responses) {
                            var datas = [];
                            var ids = [];
                            var names = [];
                            angular.forEach(responses, function (resp) {
                                var data = resp.data;
                                datas.push(data);
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
                    labelProp: "name"
                }
            }

        });
    });