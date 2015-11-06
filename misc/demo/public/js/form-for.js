/**
 * Created by leon on 15/11/6.
 */
angular.module("formForDemo", ["ui.neptune", "formFor", "formFor.bootstrapTemplates"])
    .service("DemoForm", function () {
        return {
            validationRules: {
                email: {
                    inputType: 'text',
                    pattern: /\w+@\w+\.\w+/,
                    required: true
                },
                password: {
                    inputType: 'password',
                    pattern: {
                        rule: /[0-9]/,
                        message: '密码至少包含一个数字.'
                    },
                    required: true
                }
            },
            submit: function (data) {
                debugger;
            }
        }
    })
    .controller("FormForDemoController", function (FormForConfiguration, $scope) {

        FormForConfiguration.validationFailedForCustomMessage_ = "Failed custom validation";
        FormForConfiguration.validationFailedForEmailTypeMessage_ = "Invalid email format";
        FormForConfiguration.validationFailedForIncrementMessage_ = "Value must be in increments of {{num}}";
        FormForConfiguration.validationFailedForIntegerTypeMessage_ = "Must be an integer";
        FormForConfiguration.validationFailedForMaxCollectionSizeMessage_ = "Must be fewer than {{num}} items";
        FormForConfiguration.validationFailedForMaximumMessage_ = "Must be no more than {{num}}";
        FormForConfiguration.validationFailedForMaxLengthMessage_ = "Must be fewer than {{num}} characters";
        FormForConfiguration.validationFailedForMinimumMessage_ = "Must be at least {{num}}";
        FormForConfiguration.validationFailedForMinCollectionSizeMessage_ = "Must at least {{num}} items";
        FormForConfiguration.validationFailedForMinLengthMessage_ = "Must be at least {{num}} characters";
        FormForConfiguration.validationFailedForNegativeTypeMessage_ = "Must be negative";
        FormForConfiguration.validationFailedForNonNegativeTypeMessage_ = "Must be non-negative";
        FormForConfiguration.validationFailedForNumericTypeMessage_ = "Must be numeric";
        FormForConfiguration.validationFailedForPatternMessage_ = "Invalid format";
        FormForConfiguration.validationFailedForPositiveTypeMessage_ = "Must be positive";
        FormForConfiguration.validationFailedForRequiredMessage_ = "必须输入!";

        $scope.formData = {};

        $scope.schema = {
            email: {
                label: "电子邮件:",
                inputType: 'text',
                placeholder: "请输入你的电子邮件.",
                help: "This username will be visible to others"
            },
            password: {
                label: "密码",
                inputType: 'password'
            }
        }
    });