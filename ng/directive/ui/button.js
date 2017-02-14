;(function($,angular) {
    'use strict';
    var m=angular.module('hfBaseModule');
    m .directive("hfButton",function(){
            var scope={
                status:      "@"
            },
            replace=true,
            transclude=true,
            template=
                '<button class="btn hf-btn hf-btn-primary" ng-transclude></button>';
            return {
                restrict: "E",
                scope: scope,
                transclude: transclude,
                template: template,
                replace: replace
            };
            // compile:function($e,attributes){
            //     if(attributes.color){
            //         $e.addClass('hf-btn-' + attributes.color);
            //     }
            //     if(attributes.size){
            //         $e.addClass('hf-btn-' + attributes.size)
            //     }
            //     if(attributes.radius==='radius'){
            //         $e.addClass('hf-btn-radius')
            //     }
            // }

    });


    // hfbasemodule.directive('expander', function() {
    //     return {
    //         restrict : 'EA',
    //         replace : true,
    //         transclude : true,
    //         scope : {
    //             title : '=expanderTitle'
    //         },
    //         template : '<div>'
    //         + '<div class="title" ng-click="toggle()">{{title}}</div>'
    //         + '<div class="body" ng-show="showMe" ng-transclude></div>'
    //         + '</div>',
    //         link : function(scope, element, attrs) {
    //             scope.showMe = false;
    //             scope.toggle = function toggle() {
    //                 scope.showMe = !scope.showMe;
    //             }
    //         }
    //     }
    // });
    // hfbasemodule.controller('SomeController',function($scope) {
    //     $scope.title = '点击展开';
    //     $scope.text = '这里是内部的内容。';
    // });



    m .directive("hfCreatebtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">新增</button>'
        };
    });
    m .directive("hfAddbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">添加</button>'
        };
    });
    m .directive("hfEditbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">编辑</button>'
        };
    });
    m .directive("hfConfirmbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">确认</button>'
        };
    });
    m .directive("hfSavebtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">保存</button>'
        };
    });
    m .directive("hfDelbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">删除</button>'
        };
    });
    m .directive("hfDelallbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">删除所有</button>'
        };
    });
    m .directive("hfInvitebtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">邀请</button>'
        };
    });
    m .directive("hfResendbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">重发</button>'
        };
    });
    m .directive("hfTrialbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">试算</button>'
        };
    });
    m .directive("hfSubmitbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">提交</button>'
        };
    });
    m .directive("hfResetbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">重置</button>'
        };
    });
    m .directive("hfCancelbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">取消</button>'
        };
    });
    m .directive("hfAssignebtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">产品指定</button>'
        };
    });
    m .directive("hfBackbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">返回</button>'
        };
    });
    m .directive("hfFinanceapplybtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">融资申请</button>'
        };
    });
    m .directive("hfQuotadjustbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">额度调整</button>'
        };
    });
    m .directive("hfRepaymentbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">我要还款</button>'
        };
    });
    m .directive("hfSearchbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">搜索</button>'
        };
    });
    m .directive("hfClosebtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">关闭</button>'
        };
    });
    m .directive("hfCheckbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">选中</button>'
        };
    });
    m .directive("hfCheckallbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">选中所有</button>'
        };
    });
    m .directive("hfRefreshbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">刷新</button>'
        };
    });
    m .directive("hfDetailbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">详情</button>'
        };
    });
    m .directive("hfListbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">列表</button>'
        };
    });
    m .directive("hfImportbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">导入</button>'
        };
    });
    m .directive("hfImportallbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">汇总导入</button>'
        };
    });
    m .directive("hfExportbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">导出</button>'
        };
    });
    m .directive("hfAddbankbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">银行新增</button>'
        };
    });
    m .directive("hfActivebtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">激活</button>'
        };
    });
    m .directive("hfFailbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">失效</button>'
        };
    });
    m .directive("hfEnabledbtn",function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            template:
                '<button class="btn hf-btn hf-btn-primary">启用</button>'
        };
    });
})(jQuery,angular);



