angular.module("ui.neptune", [
    'ui.neptune.tpls',
    "ui.neptune.service",
    "ui.neptune.validator",
    "ui.neptune.filter",
    "ui.neptune.directive",
    "ui.neptune.formly"
]);

angular.module("ui.neptune.service", [
    "ui.neptune.service.resource",
    "ui.neptune.service.repository",
    "ui.neptune.service.cache",
    "ui.neptune.service.datatableStore",
    "ui.neptune.service.formStore"
]);

angular.module("ui.neptune.validator", [
    'ui.neptune.validator.number2date',
    'ui.neptune.validator.bizValidator'
]);

angular.module("ui.neptune.filter", ['' +
'ui.neptune.filter.bizFilter'
]);

angular.module("ui.neptune.directive", [
    "ui.neptune.directive.datatable",
    "ui.neptune.directive.selectTree",
    "ui.neptune.directive.form"
]);
