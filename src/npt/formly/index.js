/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly", [
    "ui.neptune.formly.ui-select",
    "ui.neptune.formly.ui-mask",
    "ui.neptune.formly.wrapper-validation",
    "ui.neptune.formly.select-tree-single"]);

angular.module("ui.neptune.formly.ui-select",
    ["ui.neptune.service.resource", 'ui.select', 'ngSanitize',
        'ngAnimate',
        'ngMessages', "angular.filter"]);

angular.module("ui.neptune.formly.ui-mask", ['ui.utils.masks', "ui.mask"]);

angular.module("ui.neptune.formly.wrapper-validation", []);
