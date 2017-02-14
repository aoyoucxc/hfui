/**
 * hscf full scren  
 * control a panel to full browser
 * require: jquery.js
 */
;(function($){
  'use strict';

  var HfFullBrowser = function(element,options){
    this.$element = null;
    this.type = null;
    // true is open and false is close
    this.open = true;
    this.options = null;
    this.active = false;
    this.box = {};
    this.target = null;
    this.cloneUUID = null;
    this.BEFORE_OPEN = "open.hf.fullbrowser";
    this.AFTER_OPEN = "opened.hf.fullbrowser";
    this.BEFORE_CLOSE = "close.hf.fullbrowser";
    this.AFTER_CLOSE = "closed.hf.fullbrowser";
    this.TARGET_ACTIVE = "hf.fullbrowser.active";
    this.init('fullbrowser',element,options);
  };

  HfFullBrowser.DEFAULTS = {
    fixedHeight : true,
    target : ''
  };
  
  HfFullBrowser.prototype.init = function (type,element,options) {
    this.type = type;
    this.$element = $(element);
    this.options = this.getOptions(options);
    this.open = false;
  };

  HfFullBrowser.prototype.getDefaults = function () {
    return HfFullBrowser.DEFAULTS;
  };

  HfFullBrowser.prototype.getOptions = function(options){
    return $.extend({}, this.getDefaults(), this.$element.data(), options);
  };

  HfFullBrowser.prototype.setOptions = function(options){
    this.options = $.extend(this.options,options);
  };

  HfFullBrowser.prototype.change = function () {
    var that = this;
    var $target = that.$target = 
        typeof that.options.target == "function" ? 
        that.options.target(that.$element) :
        $(that.options.target);
    if(that.active || $target.length != 1 || $target.data( that.TARGET_ACTIVE ) ) {
      return;
    }
    that.active = true;
    $target.data[that.TARGET_ACTIVE] = true;
    if(that.open) {
      that.$element.trigger(that.BEFORE_OPEN,that.$element);
      that.box = that.countTargetBox($target);
      if(that.options.fixedHeight){
        // TODO fix element
        var $clone = $target.clone();
        var $prev = $target.prev();
        var $next = $target.next();
        var uuid = that.cloneUUID = this.getUUID();
        $clone.css("visibility","hidden");
        $clone.attr("id",uuid);
        if($prev.length>0){
          $clone.insertAfter($prev);
        }else if($next.length>0){
          $clone.insertBefore($next);
        }else {
          var $parent = $target.parent();
          $clone.appendTo($parent);
        }
      }
      $target.css("position","fixed")
          .css("marginTop","0px")
          .css("top",that.box.top+"px")
          .css("left",that.box.left+"px")
          .css("width",that.box.width+"px")
          .css("height",that.box.height+"px")
          .css("zIndex","1002")
          .css("overflow","auto")
          ;
      $("body").css("overflow","hidden");
      $target.animate({top:'0',left:'0',width:'100%',height:"100%"},function(){
        that.active = false;
        $target.data[that.TARGET_ACTIVE] = false;
        that.$element.trigger(that.AFTER_OPEN,that.$element);
      });
    } else {
      that.$element.trigger(that.BEFORE_CLOSE,that.$element);
      $target.animate({
        top:that.box.top+"px",
        left:that.box.left+"px",
        width:that.box.width+"px",
        height:that.box.height+"px"
      },function(){
        $("body").css("overflow","auto");
        $target.css("position","static")
            .css("marginTop",that.box.marginTop)
            .css("width","auto")
            .css("height","auto")
            .css("zIndex","0")
            ;
        $("#"+that.cloneUUID).remove();
        that.active = false;
        $target.data[that.TARGET_ACTIVE] = false;
        that.$element.trigger(that.AFTER_CLOSE,that.$element);
      });
    }
  };

  HfFullBrowser.prototype.getUUID = function(){
    return "hf_uuid_full_browser" + new Date().getTime();
  };

  HfFullBrowser.prototype.open = function (){
    if(!this.open){
      this.open = true;
      this.change();
    }
  };

  HfFullBrowser.prototype.close = function (){
    if(this.open){
      this.open = false;
      this.change();
    }
  };

  HfFullBrowser.prototype.toggle = function () {
    this.open = !this.open;
    this.change();
  };

  HfFullBrowser.prototype.countTargetBox = function($e){
    var box = {};
    var boundingClientRect = $e.get(0).getBoundingClientRect();
    box.top = parseInt(boundingClientRect.top);
    box.left = parseInt(boundingClientRect.left);
    box.width = $e.innerWidth()*1;
    box.height = $e.innerHeight()*1;
    box.marginTop = $e.css("marginTop");
    return box;
  };

  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('hf.fullbrowser');
      var options = $.extend({},$this.data(),typeof option == 'object' && option);

      if (!data) {
        $this.data('hf.fullbrowser', (data = new HfFullBrowser(this, options)));
      }else if(typeof options == "object"){
        data.setOptions(options);
      }
      if (typeof option == 'string'){
        data[option]();
      }
    });
  }

  var old = $.fn.hfFullbrowser;

  $.fn.hfFullbrowser             = Plugin;
  $.fn.hfFullbrowser.Constructor = HfFullBrowser;


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.hfFullbrowser.noConflict = function () {
    $.fn.hfFullbrowser = old;
    return this;
  };


  // COLLAPSE DATA-API
  // =================
  $(document).on('click.hf.fullbrowser.data-api', '[data-hf="fullbrowser"]',function(e){
    $(this).hfFullbrowser("toggle");
  });

}(window.jQuery));