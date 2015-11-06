angular.module("ui.neptune", [
    'ui.neptune.tpls',
    "ui.neptune.service",
    "ui.neptune.validator",
    "ui.neptune.filter",
    "ui.neptune.directive"
]);

angular.module("ui.neptune.service", [
    "ui.neptune.service.resource",
    "ui.neptune.service.model"
]);
angular.module("ui.neptune.validator", ['ui.neptune.validator.number2date']);
angular.module("ui.neptune.filter", []);

angular.module("ui.neptune.directive", [
    "ui.neptune.directive.datatable",
    "ui.neptune.directive.selectTree",
    "ui.neptune.directive.form"
]);
