/**
 * Created by leon on 15/11/12.
 */

angular.module("repositoryDemo", ["ui.neptune"])
    .factory("Order", function (nptRepository) {
        var repository = nptRepository("queryOrderList").params({
            "instid": "10000001468002",
            "userid": "10000001498059"
        });

        return repository;
    })
    .controller("RepositoryDemoController", function (Order, $scope, nptCache) {
        var vm = this;
        vm.post = function () {
            vm.order = Order.post().then(function (response) {
                vm.data = response.data;
                vm.cache = nptCache.get();
            }, function (error) {
                vm.data = error;
            });
        }

    });