;(function($){
    'use strict';
    var alert = function(string,callback){
        if(swal)
            swal('',string).then(callback);
        else{
            alert(string);
        }
    };
    var confirm = function(string,type){
        if(swal){
            type = type? type :null;
            return swal({
                title: '',
                text: string,
                type: type,
                showCancelButton: true
            });
        }else{
            if($){
                var deferred = $ ? $.Deferred():undefined;
                setTimeout(function(){
                    var confirm = confirm(string);
                    if(confirm === true) {
                        deferred.resolve();
                    }else
                        deferred.reject();
                },10);
                return deferred;
            }else{
                var confirm = confirm(string);
                return confirm;
            }
        }
    };
    var alertBill = function(url,callback,ajaxCallback){
        if($ && $.fn.modal){}else{return;}
        var uuid = "hf-modal-alert-"+(new Date().getTime());
        var tpl = '<div id="'+uuid+'" class="modal fade hf-modal" tabindex="-1" role="dialog"> '+
            '<div class="modal-dialog" role="document"> '+
            '<div class="modal-content"> '+
            '<div> '+
            '<div class="modal-body"> '+
            '</div> '+
            '</div> '+
            '</div> '+
            '</div> '+
            '</div> ';
        var $alertModal = $(tpl);
        var $body = $alertModal.find(".modal-body");
        $body.load(url,function(data){
            if(ajaxCallback)ajaxCallback();
            $alertModal.css("display","block");
            $body.addClass("reduce");
            $alertModal.find(".modal-dialog")
                .append('<a class="hf-close" data-dismiss="modal"><i class="fa fa-close"></i></a>');
            $("body").append($alertModal);
            var $content = $alertModal.find(".modal-content");
            var width = $content.width();
            var heiht = $content.height();
            var clientWidth = $(window).width();
            var clientHeight = $(window).height();
            var marginLeft = (clientWidth - width)/2;
            var marginHeight = (clientHeight - heiht)/2;
            var $dialog = $alertModal.find(".modal-dialog");
            $dialog.css("marginLeft",marginLeft+"px");
            $dialog.css("marginTop",marginHeight+"px");
            $('#'+uuid).modal()
                .on('hidden.bs.modal',function (e) {
                    $("#"+uuid).remove();
                    if(callback)callback();
                });
        });
    };
    if($){
        $.alert = alert;
        $.confirm = alert;
        $.alertBill = alert;
    }
    if(_h)
        _h.service("alert",{
            alert:alert,
            confirm:confirm,
            alertBill:alertBill
        });
})(jQuery);
