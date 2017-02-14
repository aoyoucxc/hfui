/**
 * hscf tabel dynamic
 * require: jquery.js
 */
;(function($){
    'use strict';
    // COLLAPSE PLUGIN DEFINITION
    // ==========================
    var HfTable = function(element,options){
        this.$element = undefined;
        this.type = undefined;
        this.isTransitioning = undefined;
        this.options = undefined;
        this.queryObject = undefined;
        this.isFullBrowser = undefined;
        this.sortList = undefined;
        this.init(element,options);
    };

    HfTable.BEFORE_CUT = "cut.hf.table";
    HfTable.AFTER_CUT = "cuted.hf.table";
    HfTable.BEFORE_REQUEST = "request.hf.table";
    HfTable.AFTER_REQUEST = "requested.hf.table";
    HfTable.REQUEST_FAILD = "fail.hf.table";
    HfTable.REQUEST_ERROR = "error.hf.table";
    HfTable.CHANGE_SEARCH = "change.hf.table";

    HfTable.DEFAULTS = {
        keywordClass: 'hf-td-important',
        moneyClass: 'hf-money',
        baseUrl: 'tets.action',
        pageIndex: 'pageIndex',
        pageRows: 'pageRows',
        sortField: 'field',
        sortType: 'type',
        sort: 'sort',
        responseStatus: 'ret_code',
        responseErrorMsg: 'ret_msg',
        responseDataset: 'dataSet',
        responsePageIndex: 'pageIndex',
        responseRowCounts: 'rowCounts',
        responsePageCounts: 'pageCounts',
        requestBefore: null,
        requestDo: null,
        renderTr: null,
        renderTd: null,
        renderAfter:null,
        pageRowsNumber: 10,
        paginationSize: 5 ,
        failTop: "连接失败，请检查网络设置！"
    };

    HfTable.prototype.init = function (element,options) {
        var that = this;
        this.queryText = null;
        that.type = "table";
        that.$element = $(element);
        that.isTransitioning = false;
        this.isFullBrowser = false;
        this.sortList = [];
        that.options = that.getOptions(options);
        // sort support
        var $dataTable = that.$element.find(".table");
        if($dataTable.length >0){
            $dataTable.find("th[data-name]").each(function(index,element){
                var $icon = $("<a class='hf-link sort none'><i class='fa fa-align-left'></i></a>")
                        .css("marginRight","5px")
                    ;
                $(element).prepend($icon).find(".sort").on("click",function(event){
                    $.hfLoad("tryOpen");
                    var $sortBtn = $(this);
                    var oldClass;
                    var newClass;
                    var oldSortList = $.map( that.sortList, function(obj){
                        return $.extend({},obj);
                    });
                    var sortObject = {};
                    if($sortBtn.hasClass("desc")){
                        oldClass = "desc";
                        newClass = "none";
                        $sortBtn.removeClass("desc").addClass("none").html("<i class='fa fa-align-left'><i>");
                    }else if($sortBtn.hasClass("none")){
                        oldClass = "none";
                        newClass = "asc";
                        $sortBtn.removeClass("none").addClass("asc").html("<i class='fa fa-sort-amount-asc'><i>");
                    }else if($sortBtn.hasClass("asc")){
                        oldClass = "asc";
                        newClass = "desc";
                        $sortBtn.removeClass("asc").addClass("desc").html("<i class='fa fa-sort-amount-desc'><i>");
                    }

                    sortObject[that.options.sortField] = $sortBtn.closest("th").data("name");
                    sortObject[that.options.sortType] = newClass;

                    that.sortList = $.grep(that.sortList,function(element,index){
                        if(element.field == sortObject.field){
                            return false;
                        }
                        return true;

                    });

                    that.sortList.push(sortObject);

                    that.render().done(function(){
                    }).fail(function(){
                        $sortBtn.removeClass(newClass).addClass(oldClass);
                        var html = "desc" == oldClass ? "<i class='fa fa-amount-desc'><i>" :
                            "asc" ==  oldClass ? "<i class='fa fa-sort-amount-asc'><i>" :
                                "<i class='fa fa-align-left'><i>";
                        $sortBtn.html(html);
                        that.sortList = null;
                        that.sortList = oldSortList;
                    });

                });
            });
        }

        // render data
        that.render();

        // hide searsh panel
        var $searshPanel = that.$element.find(".hf-table-panel-searsh");
        var $searshBtn = that.$element.find(".flagSeach");
        if($searshPanel.length > 0 && $searshBtn.length > 0){
            $searshPanel.css("display","none");
            that.$element.trigger(HfTable.CHANGE_SEARCH,that.$element);
        }
        // cut table
        if($dataTable.length >0){
            $dataTable.on("render.hf.tableDynamic",function(event){
                $(this).removeClass('hf-text-nowrap');
                that.$element.trigger(HfTable.BEFORE_CUT);
            }).on("rendered.hf.tableDynamic",function(event,$table){

                that.$element.trigger(HfTable.AFTER_CUT);
            }).on("done.hf.tableDynamic",function(event,$table){
                $(this).addClass('hf-text-nowrap');
            }).hfTableDynamic({
                keywordClass : that.options.keywordClass
            });
        }
        // full browser
        var $enlarge = that.$element.find(".enlarge");
        if( $enlarge.length > 0 ){
            $enlarge.attr("data-hf",'fullbrowser');
            $enlarge.hfFullbrowser({target:function($element){
                return $element.closest(".hf-panel");
            }}).on("opened.hf.fullbrowser",function(event,element){
                $enlarge.html('<i class="fa fa-compress">');
                $enlarge.attr("title","缩小");
                that.recoveryTable();
                that.isFullBrowser = true;
            }).on("closed.hf.fullbrowser",function(event,element){
                that.cutTable();
                $enlarge.html('<i class="fa fa-expand"></i>');
                $enlarge.attr("title","放大");
                that.isFullBrowser = false;
            });
        }
    };

    HfTable.prototype.getOptions = function(options){
        return this.options = $.extend({}, HfTable.DEFAULTS, this.options ? this.options:{} ,this.$element.data(), options);
    };

    HfTable.prototype.setOptions = function(options){
        this.options = this.getOptions(options);
    };

    HfTable.prototype.getUUID = function(){
        return "hf_uuid_table" + new Date().getTime();
    };

    HfTable.prototype.cutTable = function(){
        var that = this;
        var $dataTable = that.$element.find(".table");
        if($dataTable.length > 0){
            that.recoveryTable();
            $dataTable.hfTableDynamic("render");
        }
    };

    HfTable.prototype.recoveryTable = function(){
        var that = this;
        var $dataTable = that.$element.find(".table");
        $dataTable.find("tr").find("th").each(function(i,e){
            $dataTable.find('tr th:nth-child('+(i+1)+')').show();
            $dataTable.find('tr td:nth-child('+(i+1)+')').show();
        });
    };

    HfTable.prototype.flagSeach = function(){
        var that = this;
        var $searshPanel = that.$element.find(".hf-table-panel-searsh");
        if($searshPanel.length > 0){
            $searshPanel.slideToggle("slow",function(){
                that.$element.trigger(HfTable.CHANGE_SEARCH,that.$element);
            });
        }
    };

    HfTable.prototype.query = function(){
        var that = this;
        that.render(true);
    };

    HfTable.prototype.paging = function(targetPageIndex){
        var that = this;
        that.render(false,targetPageIndex);
    };

    HfTable.prototype.moenyData = function(){
        var that = this;
        var $table = that.$element.find(".table");
        var options = that.options;
        $table.find("th").each(function(index,element){
            var $th = $(element);
            if($th.hasClass(options.moneyClass)){
                $table.find("tbody td:nth-of-type("+(index+1)+")").addClass("hf-money");
            }
        });
    };

    HfTable.prototype.renderPagination = function(pageIndex,pageCounts){
        var that = this;
        var $pagination = that.$element.find(".hf-pagination");
        $pagination.html();
        var size = that.options.paginationSize;
        size = size > pageCounts ? pageCounts : size;
        pageIndex = pageIndex ? pageIndex < 1 ? 1 : pageIndex : 1;

        var start = pageIndex-Math.floor(size/2);
        start = start < 1 ? 1 : start;
        var maxStart = pageCounts - size + 1;
        start = start + size > pageCounts ? maxStart : start;

        var disabledClass = "";

        if(pageIndex == 1){
            disabledClass = 'hf-disabled';
        }
        var previousHtml = '<li class="'+disabledClass+'"><a class="hf-link hf-previous">上一页</a></li>\n';
        var indexHtml = '<li><a class="hf-link">1</a></li>\n';
        var lastHtml = '<li><a class="hf-link">'+pageCounts+'</a></li>\n';
        var pagesHtml = '';
        for(var i = start;i<(start*1+size*1);i++){
            var activeClass = '';
            if(i == pageIndex){
                activeClass = 'hf-active';
            }
            pagesHtml += '<li class="'+activeClass+'"><a class="hf-link">'+i+'</a></li>\n';
        }
        disabledClass = '';
        if(pageIndex == pageCounts || pageCounts === 0){
            disabledClass = 'hf-disabled';
        }
        var nextHtml = '<li class="'+disabledClass+'"><a class="hf-link hf-next">下一页</a></li>\n';
        var ellipsisHtml = '<li class="hf-disabled"><span>...</span></li>\n';

        var html = previousHtml+
            (start == 1 ? '':indexHtml)+
            (start == 1 ? '':ellipsisHtml)+
            pagesHtml+
            (start == maxStart  ? '' : ellipsisHtml)+
            (start == maxStart  ? '' : lastHtml)+
            nextHtml +'<span>共'+pageCounts+'页</span>';

        $pagination.html(html);

    };

    HfTable.prototype.render = function(isForm,targetPageIndex){
        var dtd = $.Deferred();
        var that = this;
        var $element = that.$element;
        var $table = $element.find(".hf-table-panel-table .table");
        var options = that.options;
        var $head = $($table.find("thead tr")[0]);
        $element.trigger(HfTable.BEFORE_REQUEST,$element);
        var $tbody = $('<tbody></tbody>');
        that.getData(isForm,targetPageIndex).done(function(result){
            if(result[options.responseStatus] == 200){
                var oldResult = $.extend({},result);
                if(typeof options.requestDo == "function"){
                    result = options.requestDo(result);
                }
                result = result ? result : oldResult;
                var dataset = result[options.responseDataset];
                var pageIndex = result[options.responsePageIndex];
                var rowCounts = result[options.responseRowCounts];
                var pageCounts = result[options.responsePageCounts];
                $.each(dataset,function(index,element){
                    var $tr = $('<tr></tr>');

                    $head.find("th").each(function(_index,_element){
                        var $td = $('<td></td>');
                        var $th = $(_element);
                        var data = "";
                        var bindKey = $th.data("bind");
                        data = bindKey ? element[bindKey] ? element[bindKey] : "" : "";
                        $td.html(data);
                        if(typeof options.renderTd == "function"){
                            $td = options.renderTd($td,bindKey,_index,data,element,dataset);
                        }
                        $tr.append($td);
                    });
                    if(typeof options.renderTr == "function"){
                        $tr = options.renderTr($tr,index,element,dataset);
                    }
                    $tbody.append($tr);
                });
                $table.find("tbody").remove();
                // $table.find("tfoot").remove();
                $table.append($tbody);
                that.renderPagination(pageIndex,pageCounts);
                that.moenyData();
                if(that.isFullBrowser){
                }else{
                    that.cutTable();
                }
                if(typeof options.renderAfter == "function"){
                    options.renderAfter.call(this);
                }
                dtd.resolve();
            }else {
                $table.find("tbody").remove();
                $tbody.html('<tr><td colspan="100">'+result[options.responseErrorMsg]+'</td></tr>');
                $table.append($tbody);
                $element.trigger(HfTable.REQUEST_ERROR,result[options.responseErrorMsg,$table]);
                dtd.reject();
            }
            $element.trigger(HfTable.AFTER_REQUEST,$element);
            $.hfLoad("close");
        }).fail(function(){
            $table.find("tbody").remove();
            $tbody.html('<tr><td colspan="100">'+options.failTop+'</td></tr>');
            $table.append($tbody);
            $element.trigger(HfTable.REQUEST_FAILD,$table);
            $element.trigger(HfTable.AFTER_REQUEST,$element);
            dtd.reject();
            $.hfLoad("close");
        });
        return dtd.promise();

    };

    HfTable.prototype.array2Json = function(array){
        var serializeObj={};
        $(array).each(function(){
            if(serializeObj[this.name]){
                if($.isArray(serializeObj[this.name])){
                    serializeObj[this.name].push(this.value);
                }else{
                    serializeObj[this.name]=[serializeObj[this.name],this.value];
                }
            }else{
                serializeObj[this.name]=this.value;
            }
        });
        return serializeObj;
    };

    HfTable.prototype.getData = function(isForm,targetPageIndex){
        var that = this;
        var $element = that.$element;
        var options = that.options;
        if(isForm || !that.queryObject){
            var $form = $element.find(".hf-table-panel-searsh .hf-form");
            that.queryObject = that.array2Json($form.serializeArray());
        }

        var baseUrl = options.baseUrl;

        var sortText;
        sortText = JSON.stringify(that.sortList);

        var pageIndex = targetPageIndex ? targetPageIndex : $element.find(".hf-pagination li.hf-active a").html();
        var pageRowsNumber;
        if(typeof options.pageRowsNumber == "function"){
            pageRowsNumber = options.pageRowsNumber();
        }else{
            pageRowsNumber = options.pageRowsNumber;
        }
        var url = baseUrl;

        that.queryObject[options.sort] = sortText ? sortText : "";
        that.queryObject[options.pageIndex] = (pageIndex ? pageIndex+"" : "1");
        that.queryObject[options.pageRows] = (pageRowsNumber ? pageRowsNumber : "10");

        if(typeof options.requestBefore == 'function'){
            var result = options.requestBefore(url,that.queryObject);
            if($.isArray(result)){
                url = result[0];
                that.queryObject = result[1];
            }else url = result;
        }

        return $.ajax({
            url: url,
            data: that.queryObject,
            type: "POST",
            dataType: 'json'
        });
    };

    function Plugin(option,args) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('hf.table');
            var options = $.extend({}, typeof option == 'object' && option);

            if (!data && /flagSeach|render|query|paging|enlarge/.test(options)) return;

            if (!data) {
                $this.data('hf.table', (data = new HfTable(this, options)));
            }else if(typeof option == "object"){
                data.setOptions(options);
                data.render();
            }
            if (typeof option == 'string'){
                if("paging"==option){
                    data.paging(args);
                }else{
                    data[option]();
                }
            }
        });
    }

    var old = $.fn.hfTable;

    $.fn.hfTable             = Plugin;
    $.fn.hfTable.Constructor = HfTable;


    // COLLAPSE NO CONFLICT
    // ====================

    $.fn.hfTable.noConflict = function () {
        $.fn.hfTable = old;
        return this;
    };

    $(document).on('click.hf.table.data-api',"[data-hf='table'] .flagSeach",function(e){
        $(this).closest(".hf-table-panel").hfTable('flagSeach');
    });

    $(document).on('submit.hf.table.data-api',"[data-hf='table'] .hf-table-panel-searsh form",function(e){
        try{
            $(this).closest(".hf-table-panel").hfTable('query');
        }catch(e){
        }
        return false;
    });
    $(document).on('click.hf.table.data-api',"[data-hf='table'] .hf-pagination li a.hf-previous",function(e){
        if($(this).parent().hasClass('hf-disabled')){
            return;
        }
        $.hfLoad("tryOpen");
        var targetPageIndex = $(this).closest(".hf-pagination").find("li.hf-active a").html();
        targetPageIndex = targetPageIndex*1 - 1;
        $(this).closest(".hf-table-panel").hfTable('paging',targetPageIndex);

    });
    $(document).on('click.hf.table.data-api',"[data-hf='table'] .hf-pagination li a.hf-next",function(e){
        if($(this).parent().hasClass('hf-disabled')){
            return;
        }

        $.hfLoad("tryOpen");
        var targetPageIndex = $(this).closest(".hf-pagination").find("li.hf-active a").html();
        targetPageIndex = targetPageIndex*1 + 1;
        $(this).closest(".hf-table-panel").hfTable('paging',targetPageIndex);

    });
    $(document).on('click.hf.table.data-api',"[data-hf='table'] .hf-pagination li a:not(.hf-next,.hf-previous)",function(e){
        if($(this).parent().hasClass('hf-disabled')){
            return;
        }
        $.hfLoad("tryOpen");
        var targetPageIndex = $(this).html();
        $(this).closest(".hf-table-panel").hfTable('paging',targetPageIndex);
    });
    $(document).on('click.hf.table.data-api',"[data-hf='table'] .hf-table-panel-searsh [type='reset']",function(e){
        var _this = $(this);
        var $formPanel = _this.closest(".hf-table-panel-searsh");
        $formPanel.find("[selected]").removeAttr("selected");
        $formPanel.find("[checked]").removeAttr("checked");
        var $dp = $formPanel.find("[data-hf-datetimepicker]");
        if($dp.length>0){
            $dp.datetimepicker('update');
        }
        var $sp = $formPanel.find(".selectpicker");
        if($sp.length > 0){
            $sp.val("");
            $sp.selectpicker('refresh');
        }
    });

    $(document).on('click.hf.table.data-api',"[data-hf='table'] .hf-table-panel-searsh [type='submit']",function(e){
        $.hfLoad("tryOpen");
    });
})(jQuery);