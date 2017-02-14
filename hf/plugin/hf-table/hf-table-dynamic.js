/**
 * hscf tabel dynamic
 * require: jquery.js
 */
;(function($){
  'use strict';

  // COLLAPSE PLUGIN DEFINITION
  // ==========================
  var HfTableDynamic = function(element,options){
    this.$element = $(element);
    this.type = "tableDynamic";
    this.isTransitioning = false;
    this.options = null;
    this.init(options);
    this.render();
  };

  HfTableDynamic.BEFORE_RENDER = "render.hf.tableDynamic";
  HfTableDynamic.AFTER_RENDER = "rendered.hf.tableDynamic";
  HfTableDynamic.DONE = "done.hf.tableDynamic";

  HfTableDynamic.DEFAULTS = {
    keywordClass : 'hf-td-important'
  };
  
  HfTableDynamic.prototype.init = function (options) {
    this.options = this.getOptions(options);
  };

  HfTableDynamic.prototype.getOptions = function(options){
    return this.options = $.extend({}, HfTableDynamic.DEFAULTS, this.$element.data(), options);
  };

  HfTableDynamic.prototype.setOptions = function(options){
    this.options = $.extend( this.options ? this.options:{} , options);
    this.init(options);
  };

  HfTableDynamic.prototype.getUUID = function(){
    return "hf_uuid_table_dynamic" + new Date().getTime();
  };

  HfTableDynamic.prototype.render = function(){
    // only allow table
    if(!this.$element.is('table')) return;
    var that = this;
    var $table = that.$element;
    var $parent = $table.parent();
    $table.trigger(HfTableDynamic.BEFORE_RENDER,that.$element);
    var cloneTableId = that.getUUID();
    $table.clone()
      .css("height","0")
      // .css("overflow","hidden")
      // .css("position","absolute")
      .attr("data-hf-uuid",cloneTableId)
      .appendTo($parent);
    var $cloneTable = $parent.find('[data-hf-uuid="'+cloneTableId+'"]');
    $cloneTable.find("th,td").css("white-space"," nowrap");
    var tableWidth = $table.innerWidth();
    /* for Safari */
    var clonetableWidth = 0;
    $($cloneTable.find("tr")[0]).find("td,th").each(function(index,td){
      clonetableWidth += $(td).innerWidth();
    });
    // console.log("clonetableWidth:"+clonetableWidth+",tableWidth:"+tableWidth);
    if(Math.abs(clonetableWidth - tableWidth) > 2){
      var isHide = false;
      $table.find("tr").find("th").each(function(i,e){
        var $th = $(e);
        if(!$th.hasClass(that.options.keywordClass)){
          $table.find('tr th:nth-child('+(i+1)+')').hide();
          $table.find('tr td:nth-child('+(i+1)+')').hide();
          isHide = true;
        }
      });
      if(isHide){
        $table.trigger(HfTableDynamic.AFTER_RENDER,$table);
      }
    }
    $table.trigger(HfTableDynamic.DONE,$table);
    $cloneTable.remove();
  };

  function Plugin(option) {

    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('hf.tabledynamic');
      var options = $.extend({}, typeof option == 'object' && option);

      if (!data) {
        $this.data('hf.tabledynamic', (data = new HfTableDynamic(this, options)));
      }else if(typeof option == "object"){
        data.setOptions(options);
        data["render"]();
      }
      if (typeof option == 'string'){
        data[option]();
      }
    });
  }

  var old = $.fn.hfTableDynamic;

  $.fn.hfTableDynamic             = Plugin;
  $.fn.hfTableDynamic.Constructor = HfTableDynamic;


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.hfTableDynamic.noConflict = function () {
    $.fn.hfTableDynamic = old;
    return this;
  };


  // COLLAPSE DATA-API
  // =================
  // 16.8.10
  // $(function(){
  //   $('[data-hf="tableDynamic"]').hfTableDynamic();
  // })
})(jQuery);

