;(function($,angular) {
    'use strict';
    var m=angular.module('hfBaseModule');
    m.factory("_directiveUtl",["_hf",function (_hf) {

        /**
         * 移动包装指令的属性
         * @param $attrs 属性集
         * @param $source 源元素
         * @param $target 目标元素
         */
        var removeWrapAttr = function ($attrs,$source,$target) {
            _hf.eachMap($attrs.$attr,function (k,v) {
                if(!_hf.startWith(v,"ng-") && !_hf.startWith(v,"hf-")){
                    // 保留属性
                    if(_hf.startWith(v,"w-")){
                        $source.attr(v.substring("w-".length),$attrs[k]);
                        $source.removeAttr(v);
                    }else if(_hf.startWith(v,"hng-")){
                        $target.attr(v.substring("h".length),$attrs[k]);
                        $source.removeAttr(v);
                    }
                    else{
                        $target.attr(v,$attrs[k]);
                        $source.removeAttr(v);
                    }
                }
            });
        };

        return {
            removeWrapAttr:                     removeWrapAttr
        };
    }]);
})(jQuery,angular);



