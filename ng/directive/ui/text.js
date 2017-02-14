;(function($,angular) {
    'use strict';
    var hfbasemodule=angular.module('hfBaseModule');

    hfbasemodule.directive("hfText",function(){
        return {
            restrict:'E',
            replace:true,
            template: function (element, attrs) {
                var hfattrs = getDirectiveAttrs(attrs);
                var tips = attrs.tips ? attrs.tips : "";
                var htmlText =
                    "<div class='hf-form-group' >" +
                        "<label class='hf-form-label'>" + attrs.label + "</label>" +
                        "<div><input " + "ng-model='" + attrs.name + "'" + hfattrs + "/></div>" +
                        "<span class='hf-form-suffix'>" + tips + "</span>" +
                    "</div>";

                return htmlText;
            },
            link: hfDirectiveLink
        };
    });

    hfbasemodule.directive("hfCheckbox",function(){
        return {
            restrict:'E',
            replace:true,
            template: function (element, attrs) {
                var hfattrs = getDirectiveAttrs(attrs);
                var tips = attrs.tips ? attrs.tips : "";
                var htmlText =
                    "<div class='hf-form-group' >" +
                    "<label class='hf-form-label'>" + attrs.label + "</label>" +
                    "<div><input type='checkbox' " + "ng-model='" + attrs.name + "'" + hfattrs + "/></div>" +
                    "<span class='hf-form-suffix'>" + tips + "</span>" +
                    "</div>";

                return htmlText;
            },
            link: hfDirectiveLink
        };
    });


    hfbasemodule.directive("hfTextarea",function(){
        return {
            restrict:'E',
            replace:true,
            template: function (element, attrs) {
                var hfattrs = getDirectiveAttrs(attrs);
                var tips = attrs.tips ? attrs.tips : "";
                var htmlText =
                    "<div class='hf-form-group' >" +
                    "<label>" + attrs.label + "</label>" +
                    "<div><textarea " + "ng-model='" + attrs.name + "' " + hfattrs + "/></div>" +
                    "</div>";

                return htmlText;
            },
            link: hfDirectiveLink
        };
    });

    hfbasemodule.directive("hfRadio",function(){
        return {
            restrict:'E',
            replace:true,
            template: function (element, attrs) {
                var hfattrs = getDirectiveAttrs(attrs);
                var name = attrs.name;
                var tips = attrs.tips ? attrs.tips : "";
                var htmlText =
                    "<div class='hf-form-group' >" +
                        "<label>" + attrs.label + "</label>" +
                        "<div><div class='hf-input-group'>" +
                            "<label class='hf-radio-inline' ng-repeat='rec in " + name + "'>" +
                                "<input type='radio' name='" + name + "' value='{{rec.value}}' ng-model='" + name + "Selected.value'/>{{rec.text}}" +
                            "</label>" +
                        "</div></div>" +
                        "<span class='hf-form-suffix'>" + tips + "</span>" +
                    "</div>";

                return htmlText;
            },
            link: hfDirectiveLink
        };
    });

})(jQuery,angular);

/**
 * Get angular custom directive attributes
 *
 * @param attrs Angular attribute ojbect
 * */
function getDirectiveAttrs(attrs) {
    var hfattrs = " ";
    for (var key in attrs) {
        if (key.indexOf("$") == -1  && key != "label") {
            hfattrs += key + "='" + attrs[key] + "' ";
        }
    }
    return hfattrs;
}

/**
 * Remove angular directive attributes
 * @param scope
 * @param element
 * @param attributes
 * */
function hfDirectiveLink(scope, element, attributes) {
    for (var key in attributes) {
        if (key.indexOf("$") == -1 && key != "class") {
            element.removeAttr(key);
        }
    }
}



