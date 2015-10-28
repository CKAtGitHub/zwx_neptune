/**
 * Created by leon on 15/10/28.
 */

describe("y9-datatable", function () {
    var $scope;

    beforeEach(module("datatable"));

    beforeEach(inject(function ($rootScope) {
        $scope = $rootScope;
    }));

    describe("controller", function () {
        var ctrl, $element, $attrs;

        beforeEach(inject(function ($controller) {
            $attrs = {};
            ctrl = $controller("datatableControll", {
                $scope: $scope,
                $attrs: $attrs
            });
        }));

        describe("hello", function () {
            it("hello('leon')", function () {
                var result = ctrl.hello("leon");

                expect(result).toBe("hello leon");
            });
        });
    });


});