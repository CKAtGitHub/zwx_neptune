/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */
var crypto = require('crypto');
module.exports = function() {
    return function(req,res,next) {
        var policyText = {
            "expiration": "2080-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
            "conditions": [
                ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
            ]
        };
        var accessid = 'gOZNVQRhOtfvXrCf';
        var accesskey = '8jOlpYK03Brb9EOlUoob7ywgisAuJ9';
        var host = 'http://y9mobile-user.oss-cn-shenzhen.aliyuncs.com';

        var policyBase64 = new Buffer(JSON.stringify(policyText)).toString("base64");
        var message = policyBase64;
        var hmac = crypto.createHmac('sha1', accesskey);
        hmac.update(message);
        var signature = hmac.digest('base64');
        res.send({
            host:host,
            policy:policyBase64,
            accessid:accessid,
            signature:signature,
            expire:(new Date().getTime() + 10*1000)/1000,
            dir:""
        });
    }
};
