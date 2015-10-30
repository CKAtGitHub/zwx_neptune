/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

'use strict';

var rep = require('y9-mars-repository');
var modelFactory = rep.ModelFactory();

var ClientsByAdviser = rep.Model({
    name: 'ClientsByAdviser',
    fields: [
        {name: "createby", type: "string", label:"创建人"},
        {name: "updateby", type: "string", label:"更新人"},
        {name: "createdate", type: "number", label:"创建时间"},
        {name: "updatedate", type: "number", label:"更新时间"},
        {name: "createtimestamp", type: "number", label:"创建时间戳"},
        {name: "updatetimestamp", type: "number", label:"更新时间戳"},
        {name: "disabled", type: "number", label:"是否有效", required: true},
        {name: "remark", type: "string", label:"备注"},
        {name: "id", type: "string", label:"ID", required: true},
        {name: "instid", type: "string", label:"机构ID", required: true},
        {name: "sn", type: "string", label:"SN", required: true},
        {name: "name", type: "string", label:"名称", required: true},
        {name: "fullname", type: "string", label:"全称", required: true},
        {name: "level", type: "string", label:"等级", required: true},
        {name: "clientinstid", type: "string", label:"客户机构ID"},
        {name: "contactman", type: "string", label:"联系人", required: true},
        {name: "contactphone", type: "string", label:"联系电话", required: true},
        {name: "address", type: "string", label:"地址", required: true},
        {name: "region", type: "string", label:"地区", required: true},
        {name: "source", type: "string", label:"来源", required: true},
        {name: "type", type: "string", label:"类型", required: true},
        {name: "scaleid", type: "string", label:"规模ID", required: true},
        {name: "industry", type: "string", label:"产业", required: true},
        {name: "contactposition", type: "string", label:"经营范围", required: true},
        {name: "clientadminid", type: "string", label:"客户管理员ID"}
    ],
    proxy: {
        type: "Y9",
        action: "com.yun9.ws.biz.service.QueryClientsByAdviserSerivce",
        params: {
        }
    }
});

modelFactory.reg(ClientsByAdviser);

module.exports = modelFactory;
