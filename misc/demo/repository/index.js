/**
 * Created by leon on 15/10/30.
 */


var repos = require("zwx-mars-repository");
var repository = repos.Repository();
var client = require("./Client");
var workorder = require("./Workorder");

repository.use(client);
repository.use(workorder);

module.exports = repository;


