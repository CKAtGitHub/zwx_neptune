/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

'use strict';

var rep = require('y9-mars-repository');

var modelFactory = rep.ModelFactory();

var model = rep.Model({
    name: 'WorkorderAnalysisUser',
    fields: [
        {name: "page", type: "string", required: true},
        {name: "userid", type: "string", required: true},
        {name: "allNums", type: "number"},
        {name: "completeNums", type: "number"},
        {name: "inserviceNums", type: "number"},
        {name: "waitNums", type: "number"},
        {name: "comleterate", type: "number"},
        {name: "laterate", type: "number"}
    ],
    proxy: {
        type: "Y9",
        action: "com.yun9.ws.biz.service.QueryWorkorderAnalysisUserService",
        params: {
            instid: "10000001468002"
        }
    }
});

modelFactory.reg(model);

module.exports = modelFactory;