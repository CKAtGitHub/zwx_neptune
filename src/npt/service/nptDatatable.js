/**
 * Created by leon on 15/11/9.
 */

angular.module("ui.neptune.service.datatableStore", [])
    .provider("nptDatatableStore", function () {

        this.datatables = {};

        this.datatable = function (name, datatable) {
            if (!datatable) {
                datatable = name;
                name = datatable.name;
            }

            if (!name) {
                throw new Error("datatable must have a name.");
            }
            this.datatable.name = name;
            this.datatables[name] = datatable;
            return this;
        };

        this.$get = function () {
            var self = this;
            var service = {
                /**
                 * 根据名称获取表单.
                 * @param name
                 * @param done
                 */
                datatable: function (name, done) {
                    if (name && done) {
                        if (self.datatables[name]) {
                            done(self.datatables[name]);
                        } else {
                            throw new Error("not found datatable " + name);
                        }
                    }
                },
                putDatatable: function (name, datatable) {
                    self.datatable(name, datatable);
                }
            };
            return service;

            //function Datatable(name) {
            //    this.name = name;
            //    this._header = [];
            //    this._action = [];
            //}
            //
            //Datatable.prototype.header = function header(header) {
            //    if (data && angular.isArray(header)) {
            //        this._header.concat(header);
            //    }
            //    return this;
            //};
            //
            //Datatable.prototype.action = function (name, action) {
            //
            //};
            //
            //
            //function datatableFactory(name) {
            //    var dataTable = new Datatable(name);
            //
            //
            //    return dataTable
            //}
            //
            //return datatableFactory;
        };
    });