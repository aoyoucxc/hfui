;(function($,angular) {
    'use strict';
    var m = angular.module('hfBaseModule');

    m.factory("_selectPicker",["_hf",function (_hf) {

        var Handler = function(config){
            var dft = {
                $e:            function () {},
                val:           function () {},
                selectAll:     function () {},
                deselectAll:   function () {},
                render:        function () {},
                setStyle:      function () {},
                refresh:       function () {},
                toggle:        function () {},
                hide:          function () {},
                show:          function () {},
                destroy:       function () {}
            };
            this.config = _hf.extend(dft,config);
        };

        Handler.prototype.$e = function () {
            return this.config.$e();
        };

        Handler.prototype.val = function (val) {
            this.config.val(val);
        };

        Handler.prototype.selectAll = function () {
            this.config.selectAll();
        };

        Handler.prototype.deselectAll = function () {
            this.config.deselectAll();
        };

        Handler.prototype.render = function () {
            this.config.render();
        };

        Handler.prototype.setStyle = function (clazz,op) {
            this.config.setStyle(clazz,op);
        };

        Handler.prototype.refresh = function () {
            this.config.refresh();
        };

        Handler.prototype.toggle = function () {
            this.config.toggle();
        };

        Handler.prototype.hide = function () {
            this.config.hide();
        };

        Handler.prototype.show = function () {
            this.config.show();
        };

        Handler.prototype.destroy = function () {
            this.config.destroy();
        };

        // 处理器集
        var $list = [];

        // 当前的处理器
        var $current = function(){
            if($list.length > 0)
                return $list[$list.length-1].handler;
        };

        // 添加处理器
        var $$push = function(handle,config){
            var handler = new Handler(config);
            $list.push({
                handle:     handle,
                handler:    handler
            });
        };

        /**
         * 根据句柄获取分页器
         * @param handle
         * @return {*}
         */
        var $getByHandle = function(handle){
            var handler;
            angular.forEach($list,function(handlerWrap){
                if(!handler && handlerWrap.handle === handle)
                    handler = handlerWrap.handler;
            });
            return handler;
        };

        /**
         * 得到jq对象
         */
        var $e = function () {
            if($current()) $current().$e();
        };

        /**
         * 设置当前值(对应.selectpicker('val', '..'))
         * @param val
         */
        var val = function (val) {
            if($current()) $current().val(val);
        };

        /**
         * 选择所有(对应selectpicker('selectAll'))
         */
        var selectAll = function(){
            if($current()) $current().selectAll();
        };

        /**
         * 取消所有(对应selectpicker('deselectAll'))
         */
        var deselectAll = function () {
            if($current()) $current().deselectAll();
        };

        /**
         * 重新渲染(对应selectpicker('render'))
         */
        var render = function () {
            if($current()) $current().render();
        };

        /**
         * 设置样式(对应selectpicker('setStyle'))
         * @param clazz 样式
         * @param op 对应的操纵
         */
        var setStyle = function (clazz,op) {
            if($current()) $current().setStyle(clazz,op);
        };

        /**
         * 刷新(对应selectpicker('refresh'))
         */
        var refresh = function () {
            if($current()) $current().refresh();
        };

        /**
         * 切换状态(对应selectpicker('toggle'))
         */
        var toggle = function () {
            if($current()) $current().toggle();
        };

        /**
         * 关闭(对应selectpicker('hide'))
         */
        var hide = function () {
            if($current()) $current().hide();
        };

        /**
         * 打开(对应selectpicker('show'))
         */
        var show = function () {
            if($current()) $current().show();
        };

        /**
         * 销毁(对应selectpicker('destroy'))
         */
        var destroy = function () {
            if($current()) $current().destroy();
        };

        return {
            $$push:                             $$push,
            $getByHandle:                       $getByHandle,
            $e:                                 $e,
            val:                                val,
            selectAll:                          selectAll,
            deselectAll:                        deselectAll,
            render:                             render,
            setStyle:                           setStyle,
            refresh:                            refresh,
            toggle:                             toggle,
            hide:                               hide,
            show:                               show,
            destroy:                            destroy
        };
    }]);

    m.directive("hfSelectPicker", ["_selectPicker","$timeout",function(_selectPicker,$timeout) {
        var restrict = "E",
            scope = {
                // show.bs.select 回调函数
                onShow:         "&",
                // shown.bs.select 回调函数
                onShown:        "&",
                // hide.bs.select 回调函数
                onHide:         "&",
                // hidden.bs.select 回调函数
                onHidden:       "&",
                // loaded.bs.select 回调函数
                onLoaded:       "&",
                // rendered.bs.select 回调函数
                onRendered:     "&",
                // rendered.bs.select 回调函数
                onRefreshed:    "&",
                // refreshed.bs.select回调函数
                onChanged:      "&"
            },
            require = 'ngModel',
            transclude = true,
            template = '<select ng-transclude></select>',
            replace = true,
            link = function($scope,$e,attrs,ngModelCtrl){

                var handle = attrs.delegateHandle;
                handle = handle ? handle : "dft";

                _selectPicker.$$push(handle,{
                    $e:function () {
                        return $e;
                    },
                    val:function (val) {
                        $e.selectpicker('val', val);
                    },
                    selectAll:function () {
                        $e.selectpicker('selectAll');
                    },
                    deselectAll:function () {
                        $e.selectpicker('deselectAll');
                    },
                    render: function () {
                        $e.selectpicker('render');
                    },
                    setStyle:function (clazz,op) {
                        if(op)
                            $e.selectpicker('setStyle',clazz,op);
                        else
                            $e.selectpicker('setStyle',clazz);
                    },
                    refresh: function () {
                        $e.selectpicker('refresh');
                    },
                    toggle:function () {
                        $e.selectpicker('toggle');
                    },
                    hide:function () {
                        $e.selectpicker('hide');
                    },
                    show:function () {
                        $e.selectpicker('show');
                    },
                    destroy:function () {
                        $e.selectpicker('destroy');
                    }
                });

                // $parsers:当view的值发生改变时,将view的值渲染到model的途中需要调用的函数管道
                ngModelCtrl.$formatters.push(function (value) {
                    console.log("正在进行数据格式化的值:",value);
                    return value;
                });

                // $parsers:当model的值发生改变时,将model的值渲染到view的途中需要调用的函数管道
                ngModelCtrl.$parsers.push(function (value) {
                    console.log("正在进行数据转换的值:",value);
                    return value;
                });

                ngModelCtrl.$render = function(){
                    setVal(ngModelCtrl.$viewValue || '');
                };

                var setVal = function (val) {
                    $e.val(val);
                    $e.selectpicker('refresh');
                };


                // 初始化
                var init = function(){
                    $e.selectpicker('destroy');
                    $e.selectpicker({});
                    $e.selectpicker('refresh');
                    setVal(ngModelCtrl.$viewValue || '');
                };

                var timer = $timeout(function(){
                    init();
                },0);

                // 代理change事件
                var changedCb = function () {
                    var changeVal = function(e){
                        $scope.$apply(function(){
                            ngModelCtrl.$setViewValue($e.val()*1);
                        });
                    };
                    if(attrs.onChanged)
                        return function(e){
                            changeVal(e);
                            $scope.onChanged(e);
                        };
                    else
                        return changeVal;
                };

                // 设置事件
                if(attrs.onShow)        $e.on("show.bs.select",$scope.onShown);
                if(attrs.onShown)       $e.on("shown.bs.select",$scope.onShown);
                if(attrs.onHide)        $e.on("hide.bs.select",$scope.onHide);
                if(attrs.onHidden)      $e.on("hidden.bs.select",$scope.onHidden);
                if(attrs.onLoaded)      $e.on("loaded.bs.select",$scope.onLoaded);
                if(attrs.onRendered)    $e.on("rendered.bs.select",$scope.onRendered);
                if(attrs.onRefreshed)   $e.on("refreshed.bs.select",$scope.onRefreshed);
                $e.on("changed.bs.select",changedCb());



                // 在事件应用场景中,建议使用$destroy,为一些资源进行销毁
                $scope.$on("$destroy",function(){
                    $timeout.cancel(timer);
                    $e.selectpicker('destroy');
                });
            };

        return {
            restrict: restrict,
            scope:scope,
            require:require,
            transclude:transclude,
            template:template,
            replace:replace,
            link: link
        };
    }]);
})(jQuery,angular);



