(function(factory){
    if (typeof define === 'function' && define.amd)
        define(['jquery'], factory);
    else if (typeof exports === 'object')
        factory(require('jquery'));
    else
        factory(jQuery);

}(function($){
    'use strict';
    var _h = {};
    _h.module = function(name,modual){
        _h[name] = modual;
    };
    _h.service = function(name,obj) {
        _h[name] = obj;
        for(var key in obj){
            if(obj.hasOwnProperty(key))
                _h[key] = obj[key];
        }
    };
    _h.options = {};
    window._h = _h;
}));