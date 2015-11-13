/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.formly", [
    "ui.neptune.formly.ui-select",
    "ui.neptune.formly.ui-mask",
    "ui.neptune.formly.wrapper-validation"]);

angular.module("ui.neptune.formly.ui-select",
    ["ui.neptune.service.resource",'ui.select', 'ngSanitize',
    'ngAnimate',
    'ngMessages',"angular.filter"]);

angular.module("ui.neptune.formly.ui-mask",['ui.utils.masks']);

angular.module("ui.neptune.formly.wrapper-validation",[]);
