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

router.get("/formFor", function (req, res, next) {
    res.render("form-for");
});

router.get("/selectTree", function (req, res, next) {
    res.render("select-tree");
});

router.get("/bizvalidator", function (req, res, next) {
    res.render("bizvalidator");
});

router.get("/bizfilter", function (req, res, next) {
    res.render("bizfilter");
});

router.get("/formly-example", function (req, res, next) {
    res.render("formly-example");
});
module.exports = router;