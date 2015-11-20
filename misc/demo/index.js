/**
 * Created by leon on 15/10/28.
 */
var path = require("path");
var express = require("express");
var app = express();
var router = require("./router");
var session = require("./session");
var service = require("./service");
var repository = require("./repository");
var bodyParser = require("body-parser");

app.set("views", "misc/demo/views");
app.set("view engine", "jade");

var workPath = path.resolve("");

app.use(express.static(path.join(workPath, "misc/demo/public")));
app.use(express.static(path.join(workPath, "src")));
app.use("/node_modules", express.static(path.join(workPath, "node_modules")));
app.use("/dist", express.static(path.join(workPath, "dist")));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))


app.use(service());
app.use("/service", service.service());

app.use(repository());
app.use("/model", repository.service());

app.use("/", router);
app.use("/api/session", session);


//注册服务


app.listen(3030, function () {
    console.info("启动成功!监听端口3030.");
});