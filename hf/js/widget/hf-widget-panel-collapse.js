;(function($){
    if(!$) return;
    $(function(){
        var DEFAULT = {
            hideClass: "fa fa-plus",
            showClass: "fa fa-minus",
            option: "hide"
        };
        var options = $.extend({},DEFAULT);
        $(".hf-panel-collapse").each(function(i,e){
            var $btn = $(e);
            var $context = $btn.closest(".hf-panel").find(".hf-panel-context");
            if($context){
                var option = options.option;
                $context.on("hide.bs.collapse",function(){
                    $btn.html("<i class='"+options.hideClass+"'></i>");
                }).on("show.bs.collapse",function(){
                    $btn.html("<i class='"+options.showClass+"'></i>");
                }).on("hidden.bs.collapse",function(){

                }).on("shown.bs.collapse",function(){

                });
                $btn.click(function(){
                    $context.collapse("toggle");
                });
                if(option == "hide"){
                    $btn.html("<i class='"+options.hideClass+"'></i>");
                    $context.addClass("collapse");
                }else if(option == "show"){
                    $btn.html("<i class='"+options.showClass+"'></i>");
                    $context.addClass("in");
                }else
                    return false;
            }
        });
    });
})(jQuery);