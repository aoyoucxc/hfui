/**
 * hscf edit tabel
 * require: jquery.js
 *         bootstrap-select.js
 *         bootstrap-datetimepicker.js
 */
+function($){
    'use strict';

    // COLLAPSE PLUGIN DEFINITION
    // ==========================
    var HfTableEdit = function(element,options){
        this.$element;
        this.options;
        this.init(element,options);
    }

    HfTableEdit.prototype.OPTION = "option";
    HfTableEdit.prototype.OPTION_SAVE = "option_save";
    HfTableEdit.prototype.OPTION_EDIT = "option_edit";

    HfTableEdit.DEFAULTS = {
        addElement: '.hf-add',
        addFunction: null,
        editFunction: null,
        editHtml: '<i class="hf-icon-fw fa fa-pencil-square"></i>',
        saveHtml: '<i class="hf-icon-fw fa fa-floppy-o"></i>',
        saveFuntion: null,
        disabledClass: 'hf-disabled',
        noDisabledClass: 'hf-nodisabled'
    };

    $.HfTableEdit = HfTableEdit;

    HfTableEdit.prototype.init = function (element,options) {
        this.$element = $(element);
        this.setOptions(options);
        this.initEditBtn();
        this.bindEditBtnClickEvent();
    };

    HfTableEdit.prototype.setOptions = function(options){
        this.options = $.extend({}, HfTableEdit.DEFAULTS, this.options ? this.options:{} ,this.$element.data(), options);
    };

    HfTableEdit.prototype.getUUID = function(){
        return "hf_uuid_table" + new Date().getTime();
    };

    HfTableEdit.prototype.initEditBtn = function(){
        var that = this;
        var options = that.options;
        var editIndex = that.getEditIndex();
        if(editIndex){
            var $editThs = that.$element.find(".hf-table-edit tbody td:nth-of-type("+editIndex+")");
            $editThs.each(function(index,element){
                that.save($(element));
            });
        }
    }

    HfTableEdit.prototype.edit = function($editTh){
        var $editTr = $editTh.closest("tr");
        $editTr.addClass("hf-edit");
        $editTh.html(this.options.saveHtml);
        $editTh.data(this.OPTION,this.OPTION_SAVE);
        this.removeDisabled($editTr);
        if($.type(this.options.editFunction) == 'function'){
            this.options.editFunction($editTr);
        }
    }

    HfTableEdit.prototype.save = function($editTh){
        var $editTr = $editTh.closest("tr");
        $editTr.removeClass("hf-edit");
        $editTh.html(this.options.editHtml);
        $editTh.data(this.OPTION,this.OPTION_EDIT);
        this.disabled($editTr);
    }


    HfTableEdit.prototype.editBtnClickHandle = function(event,$editTh){
        var that = this;
        var option = $editTh.data(that.OPTION);
        var $editTr = $editTh.closest("tr");
        if(option == that.OPTION_EDIT){
            that.edit($editTh);
        } else {
            that.save($editTh);
            if($.type(that.options.saveFuntion) == 'function') {
                var saveResult = that.options.saveFuntion($editTr);
                if(saveResult == false){
                    that.edit($editTh);
                }else if($.type(saveResult) == "object"){
                    $.when(saveResult).fail(function(){
                        that.edit($editTh);
                    });
                }
            }
        }
    }

    HfTableEdit.prototype.bindEditBtnClickEvent = function($editTh){
        var that = this;
        var options = that.options;
        if($editTh && $editTh.length > 0){
            $editTh.unbind("click").on("click",function(event){
                that.editBtnClickHandle(event,$editTh);
            })
        }else{
            var editIndex = that.getEditIndex();
            if(editIndex){
                var $tbody = that.$element.find(".hf-table-edit tbody");
                $tbody.find("td:nth-of-type("+editIndex+")").each(function(index,element){
                    var _$editTh = $(element);
                    _$editTh.unbind("click").on("click",function(event){
                        that.editBtnClickHandle(event,_$editTh);
                    });
                });
            }
        }
    }

    HfTableEdit.prototype.removeDisabled = function($editTr){
        var that = this;
        var disabledIndexArrays = [];
        this.$element.find(".hf-table-edit thead tr th").each(function(index,element){
            if($(element).hasClass(that.options.disabledClass)) disabledIndexArrays.push(index);
        })
        $editTr.find("td").each(function(index,element){
            if($.inArray(index,disabledIndexArrays) == -1){
                var $editTh = $(element)
                $editTh.find("input,select").removeAttr("disabled");
                var $selectpicker = $editTh.find(".selectpicker");
                // alert($editTh.find(".selectpicker").length)
                if($editTh.find(".selectpicker").length>0){
                    $editTh.find(".selectpicker").each(function(index,element){
                        $(this).selectpicker("render");
                        $(this).selectpicker("refresh");
                    })
                }
            }
        });
    }


    HfTableEdit.prototype.disabled = function($editTr){
        var that = this;
        var noDisabledIndexArrays = [];
        this.$element.find(".hf-table-edit thead tr th").each(function(index,element){
            if($(element).hasClass(that.options.noDisabledClass)) noDisabledIndexArrays.push(index);
        })
        $editTr.find("td").each(function(index,element){
            if($.inArray(index,noDisabledIndexArrays) == -1){
                var $editTh = $(element);
                $editTh.find("input,select").prop("disabled","disabled");
                var $selectpicker = $editTh.find(".selectpicker");
                $selectpicker.selectpicker("refresh");
                if($editTh.find(".selectpicker").length>0){
                    $editTh.find(".selectpicker").selectpicker("refresh");
                }
            }
        });
    }


    HfTableEdit.prototype.getEditIndex = function(){
        var editIndex;
        var $table = this.$element.find(".hf-table-edit");
        $.each($table.find("thead tr th"),function(index,_element){
            if($(this).is("[data-table-edit]")) editIndex = index+1;
        });
        return editIndex;
    }

    HfTableEdit.prototype.add = function(){
        var that = this;
        var $element = that.$element;
        var options = that.options;
        var $table = $element.find(".hf-table-edit");
        var $tbody = $table.find("tbody");
        var $template = $tbody.find("tr:first-of-type");
        if($template.length>0){
            var $cloneTemplate = $template.clone();
            $cloneTemplate = that.clearAddElement($cloneTemplate);
            $cloneTemplate.addClass("hf-edit");
            var $selectpicker = $cloneTemplate.find(".selectpicker");
            if($selectpicker.length > 0)
                $selectpicker.selectpicker();
            var $datetimepicker = $cloneTemplate.find("[data-hf-datetimepicker]");
            if($datetimepicker.length > 0)
                $datetimepicker.datetimepicker($.fn.datetimepicker.defaults);
            var editIndex = that.getEditIndex();
            if(editIndex){
                var $editTh = $cloneTemplate.find("td:nth-of-type("+editIndex+")");
                $editTh.html(options.saveHtml);
                $editTh.data(that.OPTION,that.OPTION_SAVE);
                that.edit($editTh);
                that.bindEditBtnClickEvent($editTh);
            }
            if($.type(options.addFunction) == 'function'){
                options.addFunction($cloneTemplate);
            }
            $tbody.prepend($cloneTemplate);
        }
    }

    HfTableEdit.prototype.clearAddElement = function($cloneTemplate) {
        var that = this;
        $cloneTemplate.find("input").val("");
        var $selectpickers = $cloneTemplate.find('.selectpicker');
        if($selectpickers.length>0){
            $selectpickers.each(function(index,element){
                var $selectpicker = $(element);
                var $cloneSelectpicker = $selectpicker.clone();
                $selectpicker.selectpicker('destroy');
                var $td = $selectpicker.closest("td");
                $td.find(".bootstrap-select").remove();
                $td.append($cloneSelectpicker);
            })
        }
        return $cloneTemplate;
    }

    function Plugin(option,args) {

        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('hf.table.edit');
            var options = $.extend({}, typeof option == 'object' && option);

            if (!data && /^edit|save|add$/.test(options)) return;

            if (!data) {
                $this.data('hf.table.edit', (data = new HfTableEdit(this, options)));
            }else if(typeof option == "object"){
                data.setOptions(options);
            }
            if (typeof option == 'string'){
                data[option](args);
            }
        })
    }

    var old = $.fn.hfTableEdit;

    $.fn.hfTableEdit             = Plugin;
    $.fn.hfTableEdit.Constructor = HfTableEdit;


    // COLLAPSE NO CONFLICT
    // ====================

    $.fn.hfTableEdit.noConflict = function () {
        $.fn.hfTableEdit = old;
        return this;
    };

    $(document).on('click.hf.table.edit.data-api',"[data-hf='editTable'] "+$.HfTableEdit.DEFAULTS.addElement,function(e){
        $(this).closest(".hf-table-panel").hfTableEdit('add');
    });

}(jQuery);