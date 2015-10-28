/**
 * Created by leon on 15/10/28.
 */

var express = require("express");

var router = express.Router();

router.get("/", function (req, res, next) {
    res.render("index");
})

router.get("/datatable", function (req, res, next) {
    res.render("datatable");
})

module.exports = router;