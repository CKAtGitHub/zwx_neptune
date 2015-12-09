/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.directive.nptImage", ['ui.bootstrap'])
    .controller("NptImageController",function($scope,$filter,nptImageService) {
        var vm = this;

        vm.imageId = $scope.nptImage;
        vm.options = $scope.nptImageOptions||{};

        vm.reDealWithId = function() {
            var cacheFilter = $filter("cacheFilter");
            $scope.thumbnailUrl = cacheFilter(vm.imageId,'file','thumbnailUrl');
            if (!$scope.thumbnailUrl && vm.options.repository) {
                nptImageService.init(vm.options).post(vm.imageId,function(url,error) {
                    if (error || !url) {
                        var newCacheUrl = cacheFilter(vm.imageId,'file','thumbnailUrl');
                        if (newCacheUrl) {
                            $scope.thumbnailUrl = newCacheUrl;
                        } else if (vm.options.errorImage){
                            $scope.thumbnailUrl = vm.options.errorImage;
                        }
                    } else {
                        $scope.thumbnailUrl = url;
                    }
                });
            } else if (vm.options.emptyImage) {
                $scope.thumbnailUrl = vm.options.emptyImage;
            }
        };

        if ($scope.nptImageAttr != vm.imageId) {
            $scope.$watch("nptImage",function(value) {
                vm.imageId = value;
                vm.reDealWithId();
            });
        } else {
            vm.reDealWithId();
        }


    })
    .service("nptImageService",function() {
        this.init = function(options) {
            this._searchProp = options.searchProp;
            this._labelProp = options.labelProp;
            this._repository = options.repository.params(options.params||{});
            this._valueProp = options.valueProp;
            return this;
        };

        this.post = function(value,done) {
            var self = this;
            var params = {};
            if (this._searchProp) {
                params[this._searchProp] = value;
            }
            this._repository.post(params).then(function(response) {
                var lable;
                var data = angular.isArray(response.data)?response.data:[response.data];
                if (self._valueProp) {
                    var keepGoing = true;
                    data.forEach(function(item) {
                        if (item && keepGoing && item[self._valueProp] == value) {
                            lable = item[self._labelProp];
                        }
                    });
                } else{
                    lable = data.length>0?data[0][self._labelProp]:undefined;
                }
                done(lable);
            },function(error) {
                done(null,error);
            });
        };
    })
    .directive("nptImage", function () {
        return {
            restrict: "EA",
            transclude: true, //将元素的内容替换到模板中标记了ng-transclude属性的对象上
            replace: true, //使用template的内容完全替换y9ui-datatable(自定义指令标签在编译后的html中将会不存在)
            controller: "NptImageController",
            controllerAs: "vm",
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || "/template/image/npt-image.html";
            },
            scope: {
                nptImage: "=",
                nptImageOptions: "=",
                nptImageAttr : "@"
            },
            link: function (scope, element, attrs, ctrl) {
            }
        };
    });