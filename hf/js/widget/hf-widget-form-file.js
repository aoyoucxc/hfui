;(function($){
    if(!$) return;
    $(function(){
        $(document).on('change.hf.form.data-api',".hf-form-file input:file",function(e){
            var fileNames = '';
            $.each(this.files, function() {
                fileNames +=  this.name ;
            });
            $(this).closest(".hf-form-file").find('.hf-form-file-list').text(fileNames);
        });
    });
})(jQuery);