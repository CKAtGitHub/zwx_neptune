/**
 * Created by leon on 15/10/28.
 */

var express = require("express");

var router = express.Router();

router.get("/", function (req, res, next) {
    res.render("index");
});

router.get("/datatable", function (req, res, next) {
    res.render("datatable");
});

router.get("/form", function (req, res, next) {
    res.render("form");
});

router.get("/treeselect", function (req, res, next) {
    res.render("treeselect");
});

router.get("/bizvalidator", function (req, res, next) {
    res.render("bizvalidator");
});

router.get("/bizfilter", function (req, res, next) {
    res.render("bizfilter");
});

module.exports = router;