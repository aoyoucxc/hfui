;(function($){
    if(!$) return;
    $(function(){
        $("body").find(".hf-rightsidebar-top").unbind("click").click(function() {
            $('html,body').animate({ scrollTop: 0 },700);
        });
        $(".hf-rightsidebar-bottom").unbind("click").click(function() {
            $('html,body').animate({ scrollTop: document.body.clientHeight },700);
        });
    });
})(jQuery);