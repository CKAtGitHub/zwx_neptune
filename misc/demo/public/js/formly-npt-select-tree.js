/**
 * Created by leon on 15/11/16.
 */

angular.module("formly.npt.select.tree.demo", ["ui.neptune"])
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
    .factory("QueryUserInfoById", function (nptRepository) {
        return nptRepository("QueryUserInfoById");
    })
    .controller("FormlyNptSelectTreeDemoController", function (UserListBySelectTree, OrgListBySelectTree, QueryUserInfoById) {
        var vm = this;

        vm.onSubmit = function () {
            if (vm.form.$valid) {
                vm.options.updateInitialValue();
                alert(JSON.stringify(vm.model), null, 2);
            }
        };
        vm.options = {};
        vm.model = {selectUser: "11"};
        vm.fields = [
            {
                key: 'selectUser',
                type: 'npt-select-tree-single',
                templateOptions: {
                    viewvalueQueryProp: "userid",
                    treeRepository: OrgListBySelectTree,
                    listRepository: UserListBySelectTree,
                    viewvalueRepository: QueryUserInfoById
                }
            }
        ];

        vm.originalFields = angular.copy(vm.fields);
    });