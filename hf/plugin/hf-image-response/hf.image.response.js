;(function($){
    'use strict';

    // COLLAPSE PLUGIN DEFINITION
    // ==========================
    var HfImageResponse = function(element,options){
        this.$element = null;
        this.options = null;
        this.init(element,options);
    };

    

    HfImageResponse.DEFAULTS = {
        target:null,
        renderBefore:function($img,$target){},
        renderAfter:function($img,$target){},
        renderSize:function($img,$target){}
    };

    $.HfImageResponse = HfImageResponse;

    HfImageResponse.prototype.init = function (element,options) {
        this.$element = $(element);
        this.setOptions(options);
        if(!this.options.target){
            return false;
        }
        this.render();
    };

    HfImageResponse.prototype.setOptions = function(options){
        this.options = $.extend({}, HfImageResponse.DEFAULTS, this.options ? this.options:{} ,this.$element.data(), options);
    };

    HfImageResponse.prototype.uuid = function(){
        return "hf_uuid_" + new Date().getTime();
    };

    HfImageResponse.prototype.render = function(){
        var that = this;
        var options = this.options;
        var $img = this.$element;
        var $target = $(options.target);
        var idDo = options.renderBefore.call(that,$img,$target);
        if(false === idDo) return false;
        var $imgClone = $img.clone();
        var tmp_id = this.uuid();
        var $tmp = $('<div id="'+tmp_id+'"></div>');
        // $tmp.css("position","fixed").css("top","-12000px");
        $tmp.append($imgClone);
        $("body").append($tmp);
        var _$imgClone = $("#"+tmp_id).find("img");
        _$imgClone.on("load",function(){
            var IW = _$imgClone.width();
            var IH = _$imgClone.height();
            var CW = $target.width();
            var CH = $target.height();
            var setSize = function(width,height){ 
              $img.css("width",width+"px");
              $img.css("height",height+"px");
              options.renderSize.call(that,$img,$target,width,height);
            };
            if(IW < CW && IH < CH){
              if(IW/IH > CW/CH){
                setSize(IW*(CH/IH),CH);
              }else{
                setSize(CW,IH*(CW/IW));
              }
            }else if(IW < CW && IH >= CH){
              setSize(CW,IH*(CW/IW));
            }else if(IW >= CW && IH < CH){
              setSize(IW*(CH/IH),CH);
            }else if(IW >= CW && IH >= CH){
              if(IW/IH > CW/CH){
                setSize(IW*(CH/IH),CH);
              }else{
                setSize(CW,IH*(CW/IW));
              }
            }
            options.renderAfter.call(that,$img,$target);
            $("#"+tmp_id).remove();
        });
    };

    function Plugin(option,args) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('hf.image.response');
            var options = $.extend({}, typeof option == 'object' && option);

            if (!data && /^render$/.test(options)) return;

            if (!data) {
                $this.data('hf.image.response', (data = new HfImageResponse(this, options)));
            }else if(typeof option == "object"){
                data.setOptions(options);
            }
            if (typeof option == 'string'){
                data[option](args);
            }
        });
    }

    var old = $.fn.HfImageResponse;

    $.fn.hfImageResponse             = Plugin;
    $.fn.hfImageResponse.Constructor = HfImageResponse;


    // COLLAPSE NO CONFLICT
    // ====================

    $.fn.hfImageResponse.noConflict = function () {
        $.fn.hfImageResponse = old;
        return this;
    };

    // $(function(){
    //     $('[data-hf="image-response"]').hfImageResponse();
    // });

}(jQuery));