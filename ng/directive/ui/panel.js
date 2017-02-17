;(function($,angular) {
    'use strict';
    var m=angular.module('hfBaseModule');
    m .directive("hfPanel",["_hf",function(_hf){
        var scope = {
                //面板主题
                subject:     "@"
            },
            replace = true,
            transclude = true,
            template = '<div class="hf-panel" subject="{{subject}}"' +
                'ng-transclude></div>',
            link = function ($scope,$e,$attrs) {
                var oldSubject = false;
                var watchSubjct = $scope.$watch("subject",function(val){
                    $e.addClass("hf-panel-border");
                    var subject = val || " ";
                    if(oldSubject)  $e.removeClass("hf-panel-" + oldSubject);
                    oldSubject = subject;
                    $e.addClass("hf-panel-" + subject);
                });

                $scope.$on("$destroy",function(){
                    watchSubjct();
                });
            }
            ;
        return {
            restrict:               "E",
            scope:                  scope,
            transclude:             transclude,
            template:               template,
            replace:                replace,
            link:                   link
        };
    }]);

    m .directive("hfPanelHd",["_hf",function(_hf){
        var scope = {

            },
            transclude = true,
            template =  '<div class="hf-panel-hd"><ng-transclude></div>',
            replace = true
            ;
        return {
            restrict:           "E",
            scope:              scope,
            transclude:         transclude,
            template:           template,
            replace:            replace
        };
    }]);

    m .directive("hfPanelTitle",["_hf",function(_hf){
        var scope = {
            },
            transclude = true,
            template =  '<div class="hf-panel-title"><ng-transclude></div>',
            replace = true
            ;
        return {
            restrict:           "E",
            scope:              scope,
            transclude:         transclude,
            template:           template,
            replace:            replace
        };
    }]);

    m .directive("hfPanelBd",["_hf",function(_hf){
        var scope = {

            },
            transclude = true,
            template =  '<div class="hf-panel-bd"><ng-transclude></div>',
            replace = true
            ;
        return {
            restrict:           "E",
            scope:              scope,
            transclude:         transclude,
            template:           template,
            replace:            replace
        };
    }]);

})(jQuery,angular);




