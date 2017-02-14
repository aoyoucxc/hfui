// +function($){
//     'use strict';
//     if(!$) return;
//     $(function(){
//         var DEFAULT = {
//             narrowClass: "fa fa-arrows-alt",
//             enlargeClass: "fa fa-compress"
//         };
//         var options = $.extend({},DEFAULT);
//         var $hfPanel = $(".hf-panel-full-browser");
//         $hfPanel.hfFullbrowser({target:function($element){
//             return $element.closest(".hf-panel");
//         }}).on("opened.hf.fullbrowser",function(event,element){
//             $(element).html("<i class='"+options.enlargeClass+"'></i>");
//         }).on("close.hf.fullbrowser",function(event,element){
//             $(element).html("<i class='"+options.narrowClass+"'></i>");
//         });
//         $hfPanel.unbind('click').on('click',function(){
//             $(this).hfFullbrowser("toggle");
//         });
//     });
// }(jQuery);