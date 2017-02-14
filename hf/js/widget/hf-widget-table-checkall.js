;(function($){
    'use strict';
    if(!$) return;
    $(function(){
        $(".table").find(".hf-table-checkall").on("click",function(){
            var col = $(this).parent().index() ;
            if($(this).is(":checked")){
                $(this).closest(".table").find("tbody tr").each(function(){
                    $(this).children('td:eq('+col+')').find(":checkbox").prop("checked",true);
                });
            }else{
                $(this).closest(".table").find("tbody tr").each(function(){
                    $(this).children('td:eq('+col+')').find(":checkbox").prop("checked",false);
                });
            }
        });
    });
})(jQuery);
