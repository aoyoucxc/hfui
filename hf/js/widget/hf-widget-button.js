;(function($){
    if($){
        $(function(){
            $(document).on('click.hf.button.data-api',"[data-hf-button='back']",function(e){
                $.hfLoad("tryOpen");
                history.back();
            });
            $(document).on('click.hf.button.data-api',"[data-hf-button='refresh']",function(e){
                $.hfLoad("tryOpen");
                location.replace(location.href);
            });
            $(document).on('click.hf.button.data-api',"[data-hf-button='href']",function(e){
                var url = $(this).data("href");
                var target = $(this).data("target");
                if("_blank" == target){
                    window.open(url);
                }else{
                    $.hfLoad("tryOpen");
                    window.location.href = url;
                }
            });
        });
    }
})(jQuery);

