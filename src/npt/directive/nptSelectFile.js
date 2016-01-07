/**
 * Created by leon on 15/11/16.
 */
angular.module("ui.neptune.directive.selectFile", ['ui.bootstrap'])
    .controller("SelectFileController", function ($scope, $uibModal) {
        var vm = this;
        vm.options = $scope.nptSelectFile;

        vm.selectFileApi = {
            open: function () {
                var result = $uibModal.open({
                    animation: true,
                    templateUrl: '/template/select-file/select-file-modal.html',
                    controller: 'SelectFileModalController',
                    controllerAs: 'vm',
                    resolve: {
                        selectFileData: function ($q) {
                            var deferd = $q.defer();
                            if (vm.options.fileRepository) {
                                deferd.resolve(vm.options);
                            } else {
                                deferd.reject();
                            }
                            return deferd.promise;
                        }
                    }
                }).result;
                return result;
            }
        };

        //回调设置API
        if (vm.options.onRegisterApi) {
            vm.options.onRegisterApi(vm.selectFileApi);
        }
        //设置默认选择类型
        vm.options.single = vm.options.single || false;

    })
    .controller("SelectFileModalController", function (selectFileData, $modalInstance, nptCache) {
        var vm = this;

        vm.ok = ok;
        vm.cancel = cancel;
        vm.refreshFile = refreshFile;
        vm.selectFile = selectFile;
        vm.refreshNum = refreshNum;
        vm.selectNum = 0;
        vm.options = selectFileData;

        // function definition
        function ok() {
            //检查已经选择的图片
            $modalInstance.close(getSelectFiles());
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function selectFile(item) {
            if (item) {
                if (vm.options.single) {
                    //将所有设置为非选择
                    setAllSelected(false);
                    item.selected = true;
                } else {
                    item.selected = !item.selected;
                }
                refreshNum();
            }
        }

        function refreshNum() {
            vm.selectNum = getSelectFiles().length;
        }

        function getSelectFiles() {
            var selectedFiles = [];
            if (vm.files) {
                angular.forEach(vm.files, function (FileRows) {
                    angular.forEach(FileRows, function (value) {
                        if (value.selected) {
                            selectedFiles.push(value);
                        }
                    });
                });
            }
            return selectedFiles;
        }

        function setAllSelected(state) {
            if (vm.files) {
                angular.forEach(vm.files, function (FileRows) {
                    angular.forEach(FileRows, function (value) {
                        value.selected = state;
                    });
                });
            }
        }

        function refreshFile() {
            if (vm.options.fileRepository) {
                vm.refresh = vm.options.fileRepository.post().then(function (response) {

                    vm.files = [];
                    var rows = [];
                    var index = 0;
                    angular.forEach(response.data, function (value) {

                        if (index >= 4) {
                            vm.files.push(angular.copy(rows));
                            index = 0;
                            rows = [];
                        }
                        //查找cache中的url
                        var file = nptCache.get("file", value.id);
                        var FileWrapper = {
                            file: file,
                            data: value,
                            selected: false
                        };
                        rows.push(FileWrapper);
                        index++;
                    });

                    if (rows) {
                        vm.files.push(angular.copy(rows));
                    }

                    console.info("检索成功!");
                }, function (error) {
                    console.info("检索失败!");
                });
            }
        }

        //刷新文件
        refreshFile();
    })
    .directive("nptSelectFile", function () {
        return {
            restrict: "EA",
            transclude: true, //将元素的内容替换到模板中标记了ng-transclude属性的对象上
            replace: true, //使用template的内容完全替换y9ui-datatable(自定义指令标签在编译后的html中将会不存在)
            controller: "SelectFileController",
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/select-image/select-image.html";
            },
            scope: {
                nptSelectFile: "="
            },
            link: function (scope, element, attrs, ctrl) {
            }
        };
    });