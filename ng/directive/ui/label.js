;(function($,angular) {
    'use strict';
    var m=angular.module('hfBaseModule');

    var directiveFactory = function (text,style) {
        return function(_hf){
            var replace = true,
                template = '<label class="label '+style+'">' + text +
                    '</label>'
                ;
            return {
                restrict:                   "E",
                template:                   template,
                replace:                    replace
            };
        };
    };

    m .directive("hfLabelApplied",["_hf",directiveFactory('已申请','hf-label-applied')]);
    m .directive("hfLabelLoan",["_hf",directiveFactory('已放款','hf-label-loan')]);
    m .directive("hfLabelLoaning",["_hf",directiveFactory('待放款','hf-label-loaning')]);
    m .directive("hfLabelRevocation",["_hf",directiveFactory('已撤销','hf-label-revocation')]);
    m .directive("hfLabelRefuse",["_hf",directiveFactory('已拒绝','hf-label-refuse')]);
    m .directive("hfLabelApprove",["_hf",directiveFactory('审批中','hf-label-approve')]);
    m .directive("hfLabelRefunding",["_hf",directiveFactory('还款中','hf-label-refunding')]);
    m .directive("hfLabelCleared",["_hf",directiveFactory('已清算','hf-label-cleared')]);
    m .directive("hfLabelRefund",["_hf",directiveFactory('还款确认','hf-label-refund')]);

})(jQuery,angular);




