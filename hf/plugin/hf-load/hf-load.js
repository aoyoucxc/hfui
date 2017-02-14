
/**
 * hscf load
 * require: jquery.js
 */
;(function($){
    'use strict';
    $.hfLoad = function(option,msg,type){
        var options;
        if($.type(option) == "string"){
            var _options = {};
            _options.option = option;
            if(msg) _options.msg = msg;
            if(type) _options.type = type;
            options = $.extend({},$.hfLoad.DEFAULT,_options);
        }else{
            option = option ? option : {};
            options = $.extend({},$.hfLoad.DEFAULT,option);
        }

        var _option = options.option;
        type = options.type;
        msg = options.msg;
        var status = $(window).data("hf.load.status");
        status = status ? true : false;
        if("tryOpen" == _option  && status ) {
            return;
        }
        if(_option == "open" || _option == "tryOpen"){
            $(window).data("hf.load.status",true);
            if(type == "line-spin"){
                var template =
                    '<div class="hf-load"> '+
                    '<div class="hf-loader"> '+
                    '<div class="hf-loader-line-spin">'+
                    '<div></div> '+
                    '<div></div> '+
                    '<div></div> '+
                    '<div></div> '+
                    '<div></div> '+
                    '<div></div> '+
                    '<div></div> '+
                    '<div></div> '+
                    '</div> '+
                    '<div class="hf-loader-text">'+msg+'</div>'+
                    '</div> '+
                    '</div>';
                $(template).appendTo("body");
            }
        }else if(_option == "close"){
            $(".hf-load").remove();
            $(window).data("hf.load.status",false);
        }
    };

    $.hfLoad.DEFAULT = { option:"tryOpen",type:"line-spin",msg:'正在加载中...' };

}(jQuery));



