/**
 * Created by leon on 15/11/16.
 */
angular.module("ui.neptune.directive.selectImage", ['ui.bootstrap'])
    .controller("SelectImageController", function ($scope, $uibModal) {
        var self = this;
        this.selectImageApi = {
            open: function () {
                var result = $uibModal.open({
                    animation: true,
                    templateUrl: '/template/select-image/select-image-modal.html',
                    controller: 'SelectImageModalController',
                    controllerAs: 'vm',
                    resolve: {
                        selectImageData: function ($q) {
                            var deferd = $q.defer();
                            if ($scope.nptSelectImage.imageRepository) {
                                var params = {
                                    options: $scope.nptSelectImage,
                                };
                                deferd.resolve(params);
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

        //初始化配置
        if ($scope.nptSelectImage) {
            if ($scope.nptSelectImage.onRegisterApi) {
                $scope.nptSelectImage.onRegisterApi(self.selectImageApi);
            }
        }
    })
    .controller("SelectImageModalController", function (selectImageData, $modalInstance, nptCache) {
        var vm = this;

        vm.ok = ok;
        vm.cancel = cancel;
        vm.refreshImage = refreshImage;
        vm.selectImage = selectImage;
        vm.refreshNum = refreshNum;
        vm.selectNum = 0;
        // function definition
        function ok() {
            //检查已经选择的图片
            $modalInstance.close(getSelectImages());
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function selectImage(item) {
            if (item) {
                item.selected = !item.selected;
                refreshNum();
            }
        }

        function refreshNum() {
            vm.selectNum = getSelectImages().length;
        }

        function getSelectImages() {
            var selectedImages = [];
            if (vm.images) {
                angular.forEach(vm.images, function (imageRows) {
                    angular.forEach(imageRows, function (value) {
                        if (value.selected) {
                            selectedImages.push(value);
                        }
                    });
                });
            }
            return selectedImages;
        }

        function refreshImage() {
            if (selectImageData.options.imageRepository) {
                vm.refresh = selectImageData.options.imageRepository.post().then(function (response) {

                    vm.images = [];
                    var rows = [];
                    var index = 0;
                    angular.forEach(response.data, function (value) {

                        if (index >= 4) {
                            vm.images.push(angular.copy(rows));
                            index = 0;
                            rows = [];
                        }
                        //查找cache中的url
                        var file = nptCache.get("file", value.id);
                        var imageWrapper = {
                            file: file,
                            data: value,
                            selected: false
                        };
                        rows.push(imageWrapper);
                        index++;
                    });

                    if (rows) {
                        vm.images.push(angular.copy(rows));
                    }

                    console.info("检索成功!");
                }, function (error) {
                    console.info("检索失败!");
                });
            }
        }

        //刷新图片
        refreshImage();
    })
    .directive("nptSelectImage", function () {
        return {
            restrict: "EA",
            transclude: true, //将元素的内容替换到模板中标记了ng-transclude属性的对象上
            replace: true, //使用template的内容完全替换y9ui-datatable(自定义指令标签在编译后的html中将会不存在)
            controller: "SelectImageController",
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/select-image/select-image.html";
            },
            scope: {
                nptSelectImage: "="
            },
            link: function (scope, element, attrs, ctrl) {
            }
        };
    });