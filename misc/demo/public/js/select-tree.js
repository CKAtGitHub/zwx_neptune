/**
 * Created by leon on 15/11/5.
 */

angular.module("treeSelectDemo", ["ui.neptune"])
    .factory("OrgListBySelectTree", function (nptRepository) {
        function builderOrgTreeNode(nodes, data) {
            if (data) {
                nodes.nodes = [];
                for (var i = 0; i < data.length; i++) {
                    var node = {
                        id: data[i]["id"],
                        title: data[i]["name"]
                    };
                    builderOrgTreeNode(node, data[i].children);
                    nodes.nodes.push(node);
                }
            }
        }

        return nptRepository("queryOrgTree").params({
            "instid": "10000001468002",
            "dimtype": "hr"
        }).addResponseInterceptor(function (response) {
            var orgNodes = [{
                id: response.data.id,
                title: response.data.simplename
            }];
            builderOrgTreeNode(orgNodes[0], response.data.children);
            return orgNodes;
        });

    })
    .factory("UserListBySelectTree", function (nptRepository) {
        return nptRepository("queryUsersByOrgid").addRequestInterceptor(function (request) {
            if (request.params.id) {
                request.params = {
                    orgid: request.params.id
                };
            }
            return request;
        });
    })
    .controller("treeSelectDemoController", function ($scope, UserListBySelectTree, OrgListBySelectTree) {
        var vm = this;

        this.selectTreeSetting = {
            onRegisterApi: function (selectTreeApi) {
                vm.selectTreeApi = selectTreeApi;
            },
            treeRepository: OrgListBySelectTree,
            listRepository: UserListBySelectTree
        };

        this.show = function () {
            vm.selectTreeApi.open().then(function (data) {
                $scope.item = data;
            }, function () {
                $scope.item = {
                    msg: "用户取消选择"
                }
            })
        };
    });
