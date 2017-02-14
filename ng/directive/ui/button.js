;(function($,angular) {
    'use strict';
    var m=angular.module('hfBaseModule');

    var baseScope = {
        // 按钮点击跳转到的状态
        status:      "@",
        // 按钮主题
        subject:     "@",
        // 按钮跳转到指定状态时所带的参数
        params:      "=",
        // 是否显示加载遮幕
        showLoad:    "@",
        link:        "@",
        size:        "@",
        radius:      "@"
    };
    
    var directiveFactory = function (text,icon) {
        return function(_hf){
            var scope = _hf.extend(baseScope,{
                    // 是否有图标
                    icon:           "@",
                    // 是否有文字
                    text:           "@"
                }),
                replace = false,
                template = '<hf-btn status="{{status}}" size="{{size}}" subject="{{subject}}" params="params" link="{{link}}" showLoad="{{showLoad}}">' +
                    '<span class="fa '+icon+'" ng-if="icon"></span>'+
                    ' '+
                    '<span ng-if="text">'+text+'</span>'+
                    '</hf-btn>',
                link = function($scope,$e,$attrs){
                    $scope.icon = $scope.icon + "" === "true";
                    $scope.text = $scope.text + "" !== "false";
                    console.log($scope.icon)
                }
                ;
            return {
                restrict:                   "E",
                scope:                      scope,
                template:                   template,
                replace:                    replace,
                link:                       link
            };
        }
    };

    m .directive("hfBtn",["_hf","$state",function(_hf,$state){
            var scope = baseScope,
                replace = true,
                transclude = true,
                template = '<button ng-class="{\'btn\':!link,\'hf-btn\':!link,\'hf-link\':link}" ' +
                    'ng-transclude></button>',
                link = function ($scope,$e,$attrs) {


                    $scope.link = $scope.link + "" === "true";

                    var watchSize = $scope.$watch("size",function(oldVal,newVal){
                        if(newVal){
                            $e.removeClass("hf-btn-"+oldVal);
                            $e.addClass("hf-btn-"+newVal);
                        }
                    });

                    var oldSubject = false;
                    var watchSubjct = $scope.$watch("subject",function(val){
                        var subject = val || "primary";
                        if(oldSubject)  $e.removeClass("hf-btn-" + oldSubject);
                        oldSubject = subject;
                        $e.addClass("hf-btn-" + subject);
                    });

                    if($scope.status){
                        $e.unbind("click").on("click",function () {
                            if($scope.params)
                                $state.go($scope.status,$scope.params);
                            else
                                $state.go($scope.status);
                        });
                    }

                    $scope.$on("$destroy",function(){
                        watchSubjct();
                        watchSize();
                    });
                }
            ;
            return {
                restrict:               "E",
                scope:                  scope,
                transclude:             transclude,
                template:               template,
                replace:                replace,
                link:                   link
            };


    }]);

    m .directive("hfBtnCreate",["_hf",directiveFactory('新增','fa-plus-square-o')]);
    m .directive("hfBtnAdd",["_hf",directiveFactory('添加','fa-plus-square')]);
    m .directive("hfBtnEdit",["_hf",directiveFactory('编辑','fa-pencil-square')]);
    m .directive("hfBtnConfirm",["_hf",directiveFactory('确认','fa-check')]);
    m .directive("hfBtnSave",["_hf",directiveFactory('保存','fa-floppy-o')]);
    m .directive("hfBtnDel",["_hf",directiveFactory('删除','fa-trash-o')]);
    m .directive("hfBtnDelall",["_hf",directiveFactory('删除所有','fa-trash-o')]);
    m .directive("hfBtnInvite",["_hf",directiveFactory('邀请','fa-paper-plane-o')]);
    m .directive("hfBtnResend",["_hf",directiveFactory('重发','fa-share-square-o')]);
    m .directive("hfBtnTrial",["_hf",directiveFactory('试算','fa-calculator')]);
    m .directive("hfBtnSubmit",["_hf",directiveFactory('提交','fa-check-circle')]);
    m .directive("hfBtnReset",["_hf",directiveFactory('重置','fa-rotate-left')]);
    m .directive("hfBtnCancel",["_hf",directiveFactory('取消','fa-times')]);
    m .directive("hfBtnAssigne",["_hf",directiveFactory('产品指定','fa-crosshairs')]);
    m .directive("hfBtnBack",["_hf",directiveFactory('返回','fa-repeat')]);
    m .directive("hfBtnFinanceapply",["_hf",directiveFactory('融资申请','fa-registered')]);
    m .directive("hfBtnQuotadjust",["_hf",directiveFactory('额度调整','fa-rmb')]);
    m .directive("hfBtnRepayment",["_hf",directiveFactory('我要还款','fa-money')]);
    m .directive("hfBtnSearch",["_hf",directiveFactory('搜索','fa-search')]);
    m .directive("hfBtnClose",["_hf",directiveFactory('关闭','fa-close')]);
    m .directive("hfBtnCheck",["_hf",directiveFactory('选中','fa-check-square-o')]);
    m .directive("hfBtnCheckall",["_hf",directiveFactory('选中所有','fa-check-square')]);
    m .directive("hfBtnRefresh",["_hf",directiveFactory('刷新','fa-refresh')]);
    m .directive("hfBtnDetail",["_hf",directiveFactory('详情','fa-info-circle')]);
    m .directive("hfBtnList",["_hf",directiveFactory('列表','fa-bars')]);
    m .directive("hfBtnImport",["_hf",directiveFactory('导入',' fa-mail-forward')]);
    m .directive("hfBtnImportall",["_hf",directiveFactory('汇总导入',' fa-mail-forward')]);
    m .directive("hfBtnExport",["_hf",directiveFactory('导出',' fa-mail-reply')]);
    m .directive("hfBtnAddbank",["_hf",directiveFactory('银行新增',' fa-plus')]);
    m .directive("hfBtnActive",["_hf",directiveFactory('激活',' fa-gear')]);
    m .directive("hfBtnFail",["_hf",directiveFactory('失败','fa-exclamation-circle')]);
    m .directive("hfBtnEnabled",["_hf",directiveFactory('启用','fa-unlock')]);
})(jQuery,angular);



