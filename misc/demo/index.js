/**
 * Created by leon on 15/10/28.
 */
var path = require("path");
var express = require("express");
var app = express();
var router = require("./router");

app.set("views", "misc/demo/views");
app.set("view engine", "jade");

var workPath = path.resolve("");

app.use(express.static(path.join(workPath, "misc/demo/public")));
app.use(express.static(path.join(workPath, "src")));

app.use("/", router);


app.listen(3000, function () {
    console.info("启动成功!监听端口3000.");
});