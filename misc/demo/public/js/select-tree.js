/**
 * Created by leon on 15/11/5.
 */

angular.module("treeSelectDemo", ["ui.neptune"])
    .config(function (SelectTreeProvider) {

        SelectTreeProvider.setListHandler("selectUser", function (nptResource, id, done) {
            //根据组织ID查询用户列表
            nptResource.post("queryUsersByOrgid", {
                "orgid": id
            }, function (data) {
                if (done) {
                    done(data);
                }
            }, function (data) {

            });
        });

        SelectTreeProvider.setTreeHandler("selectUser", function (nptResource, done) {
            var org = {
                builderOrgTreeNode: function (nodes, data) {
                    if (data) {
                        nodes.nodes = [];
                        for (var i = 0; i < data.length; i++) {
                            var node = {
                                id: data[i]["id"],
                                title: data[i]["name"]
                            };
                            org.builderOrgTreeNode(node, data[i].children);
                            nodes.nodes.push(node);
                        }
                    }
                }
            };

            nptResource.post("queryOrgTree", {
                "instid": "10000001468002",
                "dimtype": "hr"
            }, function (data) {
                var orgNodes = [{
                    id: data.id,
                    title: data.simplename
                }];
                org.builderOrgTreeNode(orgNodes[0], data.children);
                if (done) {
                    done(orgNodes);
                }
            }, function (data) {
            });
        });
    })
    .controller("treeSelectDemoController", function ($scope) {
        $scope.show = function () {
            var result = $scope.demoTreeSelect.open();
            result.then(function (data) {
                $scope.item = data;
            }, function () {
                $scope.item = {
                    msg: "用户取消选择"
                }
            })
        };
    });
