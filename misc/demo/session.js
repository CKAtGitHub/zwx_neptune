/**
 * Created by leon on 15/11/13.
 */

var express = require("express");
var router = express.Router();

module.exports = router;

router.get("/", function (req, res, next) {

    res.send({
        user: {
            id: "111",
            name: "123123",
            inst: {
                id: "123123",
                name: "深圳市顶聚科技有限公司"
            },
            insts: [
                {
                    id: "122",
                    name: "测试公司1"
                },
                {
                    id: "12333",
                    name: "测试公司2"
                }
            ]
        }
    });

});