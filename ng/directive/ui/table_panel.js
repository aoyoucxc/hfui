;(function($,angular) {
    'use strict';
    var a=angular.module('hfBaseModule');
       a .directive("hfTablea",function(){
            return {
                restrict:'AECM',
                template:'<div>hello my directive</div>'
            };
        });
    a.directive("hfTableab",function(){
        return {
            restrict:'AECM',
            transclude:false,
            template:"<div> <div ng-transclude></div> haha!wuwu!</div>"

        };
    });

})(jQuery,angular);



