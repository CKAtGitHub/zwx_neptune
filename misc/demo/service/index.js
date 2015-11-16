/**
 * Created by leon on 15/10/30.
 */
var service = require("y9-mars-service");
var proxy = service.Proxy();

//注册策略
proxy.use("Y9", service.ProxyY9({
    token: "8fc50dd14a951318ca168e40a9fa1ec78d1110e058700c9affdbe6ab5eb6b931",
    baseurl: "http://120.24.84.201:10080/ws-biz/service/action.yun9",
    header: {}
}));

//注册动作
proxy.action("queryOrderList", {
    proxy: "Y9",
    action: "com.yun9.ws.biz.service.QueryOrdersByStateService"
}).action("queryOrderInfo", {
    proxy: "Y9",
    action: "com.yun9.ws.biz.service.QueryOrderInfoService"
}).action("queryUsersByOrgid", {
    proxy: "Y9",
    action: "com.yun9.sys.user.service.QueryUsersByOrgidService"
}).action("queryOrgTree", {
    proxy: "Y9",
    action: "com.yun9.sys.inst.serivce.QueryOrgTreeService"
}).action("QueryMdCtrlcode", {
    proxy: "Y9",
    action: "com.yun9.sys.md.service.QueryMdCtrlcodeService"
}).action("QueryUserInfoById", {
    proxy: "Y9",
    action: "com.yun9.sys.user.service.QueryUserInfoByIdService"
});

module.exports = proxy;


