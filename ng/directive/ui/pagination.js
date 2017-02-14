;(function($,angular) {
    'use strict';
    var m = angular.module('hfBaseModule');
    m.factory("_pagination",["_hf",function (_hf) {
        var Pagination = function(config){
            var dft = {
                onSelectPage:   function () {},
                onFirst:        function () {},
                onLast:         function () {},
                onNext:         function () {},
                onPre:          function () {},
                onGetPages:     function () {},
                onGetShow:      function () {},
                onGetCurrent:   function () {}
            };
            this.config = _hf.extend(dft,config);
        };

        Pagination.prototype.selectPage = function(index){
            this.config.onSelectPage(index);
        };

        Pagination.prototype.first = function(){
            this.config.onFirst();
        };

        Pagination.prototype.last = function(){
            this.config.onLast();
        };

        Pagination.prototype.next = function(){
            this.config.onNext();
        };

        Pagination.prototype.pre = function(){
            this.config.onPre();
        };

        Pagination.prototype.getPages = function(){
            return this.config.onGetPages();
        };

        Pagination.prototype.getShow = function(){
            return this.config.onGetShow();
        };

        Pagination.prototype.getCurrent = function(){
            return this.config.onGetCurrent();
        };

        // 当前的分页器
        var $currentPagination = function(){
            if($paginationList.length > 0)
                return $paginationList[$paginationList.length - 1].pagination;
        };
        // 分页器集
        var $paginationList = [];

        var $$pushPagination = function(handle,config){
            var pagination = new Pagination(config);
            $paginationList.push({
                handle:     handle,
                pagination: pagination
            });
        };

        // 选中特定的页数
        var selectPage = function(index){
            if($currentPagination()) $currentPagination().selectPage(index);
        };

        // 第一页
        var first = function(){
            if($currentPagination()) $currentPagination().first();
        };

        // 最后一页
        var last = function(){
            if($currentPagination()) $currentPagination().last();
        };

        // 下一页
        var next = function(){
            if($currentPagination()) $currentPagination().next();
        };

        // 上一页
        var pre = function(){
            if($currentPagination()) $currentPagination().pre();
        };

        /**
         * 得到当前分页器的所有页数
         *   该属性在需要在指令编译好了之后才会有值
         **/
        var getPages = function(){
            if($currentPagination()) return $currentPagination().getPages();
        };

        // 得到当前分页器的展示页数
        var getShow = function(){
            if($currentPagination()) return $currentPagination().getShow();
        };

        // 得到当前分页器的当前页
        var getCurrent = function(){
            if($currentPagination()) return $currentPagination().getCurrent();
        };

        /**
         * 根据句柄获取分页器
         * @param handle
         * @return {*}
         */
        var $getByHandle = function(handle){
            var pagination;
            angular.forEach($paginationList,function(paginationWrap){
                if(!pagination && paginationWrap.handle === handle)
                    pagination = paginationWrap.pagination;
            });
            return pagination;
        };

        return {
            $$pushPagination:                   $$pushPagination,
            selectPage:                         selectPage,
            first:                              first,
            last:                               last,
            next:                               next,
            pre:                                pre,
            getPages:                           getPages,
            getShow:                            getShow,
            getCurrent:                         getCurrent,
            $getByHandle:                       $getByHandle
        };
    }]);
    m.directive("hfPagination", ["_pagination",function(_pagination) {
        var template =
            '<div class="hf-pagination-wrap hf-pagination-center"> '+
                '<ul class="hf-pagination-box"> '+
                    '<li class="hf-pagination-item" '+
                        'ng-class="{\'hf-pagination-disable\':current === 1}" '+
                        'ng-click="prePage();">上一页</li> '+
                    '<li class="hf-pagination-item hf-pagination-disable" ng-show="start !== 1">...</li> '+
                    '<li class="hf-pagination-item" '+
                        'ng-repeat="pageItem in pageList" '+
                        'ng-bind="pageItem" '+
                        'ng-click="clickPage($event);" '+
                        'ng-class="{\'hf-pagination-active\':pageItem == current}"></li> '+
                    '<li class="hf-pagination-item hf-pagination-disable" '+
                        'ng-show="start <= (pages - show)">...</li> '+
                    '<li class="hf-pagination-item" '+
                        'ng-class="{\'hf-pagination-disable\':current === pages}" '+
                        'ng-click="nextPage();">下一页</li> '+
                '</ul> '+
            '</div>';

        var link = function($scope,$e,attrs){

            var handle = attrs.delegateHandle;
            handle = handle ? handle : "dft";

            var render = function(show,pages,current){
                show = show * 1;
                pages = pages * 1;
                current = current * 1;
                var _show = Math.floor(show / 2);
                current = current < 1 ? 1 : current > pages ? pages : current;
                if(current !== $scope.current*1 ){
                    $scope.current = current ;
                }
                $scope.show = show > pages ? pages : show;
                show = $scope.show;
                var list = [];
                $scope.start = current - _show < 1 ? 1 :
                    pages - current < _show ? pages - show + 1:
                    current - _show;
                for(var i = 0; i < $scope.show ; i++){
                    list.push(i + $scope.start);
                }
                $scope.pageList = list;
            };

            _pagination.$$pushPagination(handle,{
                onSelectPage:   function (index) {
                    $scope.current = index;
                },
                onFirst:        function () {
                    $scope.current = 1;
                },
                onLast:         function () {
                    $scope.current = $scope.pages;
                },
                onNext:         function () {
                    $scope.current --;
                },
                onPre:          function () {
                    $scope.current ++;
                },
                onGetPages:     function () {
                    return $scope.pages;
                },
                onGetShow:      function () {
                    return $scope.show;
                },
                onGetCurrent:   function () {
                    return $scope.current;
                }
            });


            // 如果改变了current,pages,show值时,都发生重绘分页
            var watchCurrent = $scope.$watch('current',function(value){
                render($scope.show,$scope.pages,value);
                // 当当前页发生改变时,调用selectPage
                $scope.selectPage();
            });

            var watchPages = $scope.$watch('pages',function(value){
                render($scope.show,value,$scope.current);
            });

            var watchShow = $scope.$watch('show',function(value){
                render(value,$scope.pages,$scope.current);
            });

            $scope.$on("$destroy",function(){
                watchCurrent();
                watchPages();
                watchShow();
            });

        };

        var ctrl =["$scope",function($scope){
            $scope.clickPage = function($event){
                $scope.current = $($event.target).html()*1;
            };
            $scope.selectPage = function(){
                if($scope.onSelectPage)
                    $scope.onSelectPage($scope.current);
            };

            $scope.prePage = function(){
                $scope.current --;
            };

            $scope.nextPage = function(){
                $scope.current ++;
            };
        }];

        return {
            $scope:{
                pages:"@",
                show:"=",
                current:"=",
                onSelectPage:"&"
            },
            restrict: 'E',
            template: template,
            replace: true,
            controller:ctrl,
            link:link
        };
    }]);
})(jQuery,angular);



