;(function($){
    if(!$) return;
    $(function(){
        var func = function(){
            var winHeight=$(window).height();
            var bodyHeight=$("body").height()+8;
            var diffHeight = winHeight-bodyHeight;
            if(diffHeight>0){
                var $layout=$(".hf-layout");
                var layoutHeight=$layout.height();
                layoutHeight=layoutHeight+diffHeight;
                var $menuGroup=$(".hf-menu-group");
                $menuGroup.css("height",layoutHeight+"px");
            }
        };
        func();
        $(window).unbind("resize").resize(function(){
            func();
        });
    });
})(jQuery);
