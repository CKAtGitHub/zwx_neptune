/**
 * Created by leon on 15/11/9.
 */

angular.module('formlyExample', ['ui.neptune'])
    .controller("formlyExampleController", function ($scope,nptRepository) {
        var vm = this;
        nptRepository("queryUsersByOrgid").post({"orgid":"10000001468035"})
            .then(function(response) {
                if (response.data && response.data.length > 0) {
                    vm.ctrlCode = response.data[0].id;
                }
            });
    });