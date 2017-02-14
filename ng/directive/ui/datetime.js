/**
 * 当前指令的实现由bootstrap-datetimepicker v4版本
 */
;(function($,angular) {
    'use strict';
    var m = angular.module('hfBaseModule');

    m.factory("_datetime",["_hf",function (_hf) {

        var Handler = function(config){
            var dft = {
                $e:             function () {},
                destroy:        function () {},
                toggle:         function () {},
                show:           function () {},
                hide:           function () {},
                disable:        function () {},
                enable:         function () {},
                clear:          function () {}
            };
            this.config = _hf.extend(dft,config);
        };

        Handler.prototype.$e = function () {
            return this.config.$e();
        };

        Handler.prototype.destroy = function () {
            return this.config.destroy();
        };

        Handler.prototype.toggle = function () {
            return this.config.toggle();
        };

        Handler.prototype.show = function () {
            return this.config.show();
        };

        Handler.prototype.hide = function () {
            return this.config.hide();
        };

        Handler.prototype.disable = function () {
            return this.config.disable();
        };

        Handler.prototype.enable = function () {
            return this.config.enable();
        };

        Handler.prototype.clear = function () {
            return this.config.clear();
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
         * 得到当前操作的jQuery元素
         */
        var $e = function () {
            if($current()) $current().$e();
        };

        /**
         * 销毁
         */
        var destroy = function () {
            if($current()) $current().destroy();
        };

        /**
         * 切换日期面板显示状态
         */
        var toggle = function () {
            if($current()) $current().toggle();
        };

        /**
         * 显示日期面板
         */
        var show = function () {
            if($current()) $current().show();
        };

        /**
         * 隐藏日期面板
         */
        var hide = function () {
            if($current()) $current().hide();
        };

        /**
         * 禁用输入框
         */
        var disable = function () {
            if($current()) $current().disable();
        };

        /**
         * 启用输入框
         */
        var enable = function () {
            if($current()) $current().enable();
        };

        /**
         * 清空输入框
         */
        var clear = function () {
            if($current()) $current().clear();
        };

        return {
            $$push:                             $$push,
            $getByHandle:                       $getByHandle,
            $e:                                 $e,
            destroy:                            destroy,
            toggle:                             toggle,
            show:                               show,
            hide:                               hide,
            disable:                            disable,
            enable:                             enable,
            clear:                              clear
        };
    }]);

    var baseScope = {
        // 日期格式,不同的日期格式会影响展示模型的展示,值为字符串,日期格式为moment的日期格式
        format:                "=",
        // 最低日期,可接受date, moment, string
        minDate:               "=",
        // 最高日期,可接受date, moment, string
        maxDate:               "=",
        // 禁用在数组的日期,可接受date, moment, string的数组
        disabledDates:         "=",
        // 禁用不在数组的日期,可接受date, moment, string的数组
        enableDates:           "=",
        // 禁用每周中指定的日期,比如周末,0代表星期一,可接受一个0到6的数组
        daysOfWeekDisable:     "=",
        // 首次展示模型,可以是'decades'(十年),'years'(年),'months'(月),'days'(天)
        viewMode:               "=",
        // 是否展示选中当前日期按钮
        showToday:              "=",
        // 是否显示清除按钮
        showClear:              "=",
        // 是否显示关闭按钮
        showClose:              "=",
        // 再选中日期后是否关闭日期面板
        keepOpen:               "=",
        // 禁用日期的回调函数,参数为
        onDisabled:             "&",
        // 在隐藏组件时触发,执行toggle(),hide(),disable()操作会触发,参数为$date
        onHide:                 "&",
        // 在显示组件时触发,执行toggle(),show()操作触发,参数为$date
        onShow:                 "&",
        // 在改变日期值时触发,参数为$date,$oldDate
        onChange:               "&",
        // 在选择的日期不通过验证触发,参数为$date
        onError:                "&",
        // 当显示日期发生改变时触发,参数为$change,$viewDate
        onUpdate:               "&"
    };

    m.directive("hfDatetime", ["_datetime","_hf",function(_datetime,_hf){
        var require = '?ngModel',
            transclude = true,
            replace = true,
            template =  '<input class="hf-form-field"/>',
            link = function ($scope,$e,$attrs,ngModalCtrl) {

                // var $target = $e;

                var handle = $attrs.delegateHandle;
                handle = handle || "dft";

                _datetime.$$push(handle,{
                    $e:             function () {
                        return $e;
                    },
                    destroy:        function () {
                        $e.data("DateTimePicker").destroy();
                    },
                    toggle:         function () {
                        $e.data("DateTimePicker").toggle();
                    },
                    show:           function () {
                        $e.data("DateTimePicker").show();
                    },
                    hide:           function () {
                        $e.data("DateTimePicker").hide();
                    },
                    disable:        function () {
                        $e.data("DateTimePicker").disable();
                    },
                    enable:         function () {
                        $e.data("DateTimePicker").enable();
                    },
                    clear:          function () {
                        $e.data("DateTimePicker").clear();
                    }
                });

                (function(){
                    var dateTimePicker = $e.data('DateTimePicker');
                    if(dateTimePicker) dateTimePicker.destroy();
                    $e.datetimepicker({});
                })();

                var onChange = false;

                if(ngModalCtrl){
                    ngModalCtrl.$formatters.push(function(date){
                        if( angular.isDefined(date) && date !== null && !angular.isDate(date) )
                            throw new Error('ng-modal value must be a Date object!');
                        return date;
                    });

                    ngModalCtrl.$render = function () {
                        $e.data("DateTimePicker").date(ngModalCtrl.$viewValue);
                    };

                    onChange = function (date) {
                        ngModalCtrl.$setViewValue(date);
                    };
                }

                var watchFormat = $scope.$watch("format",function (val) {
                    if(val)
                        $e.data("DateTimePicker").format(val);
                });

                var watchMinDate = $scope.$watch("minDate",function (val) {
                    if(val)
                        $e.data("DateTimePicker").minDate(val);
                },true);

                var watchMaxDate = $scope.$watch("maxDate",function (val) {
                    if(val)
                        $e.data("DateTimePicker").maxDate(val);
                },true);

                var watchDisabledDates = $scope.$watch("disabledDates",function (val) {
                    if(val)
                        $e.data("DateTimePicker").disabledDates(val);
                },true);

                var watchEnableDates = $scope.$watch("enableDates",function (val) {
                    if(val)
                        $e.data("DateTimePicker").enabledDates(val);
                });

                var watchDaysOfWeekDisable = $scope.$watch("daysOfWeekDisable",function (val) {
                    if(val)
                        $e.data("DateTimePicker").daysOfWeekDisabled(val);
                });

                var watchViewMode = $scope.$watch("viewMode",function (val) {
                    if(val)
                        $e.data("DateTimePicker").viewMode(val);
                });

                var watchShowToday = $scope.$watch("showToday",function (val) {
                    $e.data("DateTimePicker").showTodayButton(_hf.isTrue(val));
                });

                var watchShowClear = $scope.$watch("showClear",function (val) {
                    $e.data("DateTimePicker").showClear(_hf.isTrue(val));
                });

                var watchShowClose = $scope.$watch("showClose",function (val) {
                    $e.data("DateTimePicker").showClose(_hf.isTrue(val));
                });

                var watchKeepOpen = $scope.$watch("keepOpen",function (val) {
                    $e.data("DateTimePicker").keepOpen(_hf.isTrue(val));
                });

                if($attrs.onDisabled) {
                    $e.data("DateTimePicker").onDisabled(function (dateMoment,showModel) {
                        return $scope.onDisabled({
                            dateMoment:dateMoment,
                            showModel:showModel
                        });
                    });
                }

                if($attrs.onHide) {
                    $e.on("dp.hide",function(e){
                        $scope.onHide({$date:e.date});
                    });
                }

                if($attrs.onShow) {
                    $e.on("dp.show",function(e){
                        $scope.onHide({$date:e.date});
                    });
                }

                if($attrs.onChange || onChange !== false) {
                    $e.on("dp.change",function(e){
                        if(onChange) onChange(e.date);
                        if($attrs.onChange) $scope.onChange({$date:e.date,$oldDate:e.oldDate});
                    });
                }

                if($attrs.onError) {
                    $e.on("dp.error",function(e){
                        $scope.onError({$date:e.date});
                    });
                }

                if($attrs.onUpdate){
                    $e.on("dp.update",function(e){
                        $scope.onUpdate({$change:e.change,$viewDate:e.viewDate});
                    });
                }

                // 在事件应用场景中,建议使用$destroy,为一些资源进行销毁
                $scope.$on("$destroy",function(){
                    watchFormat();
                    watchMinDate();
                    watchMaxDate();
                    watchDisabledDates();
                    watchEnableDates();
                    watchDaysOfWeekDisable();
                    watchViewMode();
                    watchShowToday();
                    watchShowClear();
                    watchShowClose();
                    watchKeepOpen();
                });
            }
        ;
        return {
            restrict:           "E",
            scope:              baseScope,
            require:            require,
            transclude:         transclude,
            template:           template,
            replace:            replace,
            link:               link
        };
    }]);

    m.directive("hfDatetimeGroup", ["_hf","$compile","_directiveUtl",function(_hf,$compile,_directiveUtl) {
        /***
         *  hfDatetimeGroup为包装指令
         *      包装指令是操作元素放在其他元素中间,比如hfDatetime指令中当hfGroup为true时,input元素放在一个div里面
         *      这里的div就是包装元素,input就是操作元素,这个指令就为包装指令
         *      angular会默认将指令上的所有的属性转移到模版的最外层元素上去,在包装指令中,属性会转移到包装元素上去,这是我们不期望的。
         *      包装指令在编译指令中,应该将一些属性转移到操作元素上去,这样对可以对使用者透明,隐藏细节
         *      属性转换规则:
         *          ng-开头的属性不转移,ng开头的属性为angular自带的指令,用户在使用的一般愿景是放在操作元素上,但实际上
         *              它会在包装元素起作用,就算把它转移到操作元素,包装元素还是会有效果。所以,对于需要在通过指令绑定angular指令到
         *              操作元素的话,使用hng-开头的表明属性。
         *              eg:
         *                  <hf-datetime hf-group="true" ng-click="..."></hf-datetime> =>
         *                      <div class="hf-input-group hf-datepicker-date" ng-click="">
         *                          ...
         *                          <input class="hf-form-field" readonly/>
         *                      </div>
         *                  <hf-datetime hf-group="true" hng-click="..."></hf-datetime> =>
         *                      <div class="hf-input-group hf-datepicker-date">
         *                          ...
         *                          <input class="hf-form-field" readonly ng-click="" />
         *                      </div>
         *          hng-开头的属性转移,用法见上一条ng-属性的说明
         *          hf-开头的属性不转移,hf-开头的属性代表的是指令的属性,不需要转移
         *              eg:
         *                  <hf-datetime hf-group="true"></hf-datetime> 使用输入框组
         *          w-开头的属性不转移,w-开头的属性代表使用在包装元素的属性,这些属性不转移,并且会将w-截取,设置到包装元素上
         *              eg:
         *                  <hf-datetime hf-group="true" w-id="test"></hf-datetime> =>
         *                      <div class="hf-input-group hf-datepicker-date" id="test">
         *                          ...
         *                          <input class="hf-form-field" readonly/>
         *                      </div>
         *           其他属性转移
         *              eg:
         *                  <hf-datetime hf-group="true" id="test"></hf-datetime> =>
         *                      <div class="hf-input-group hf-datepicker-date">
         *                          ...
         *                          <input class="hf-form-field" readonly id="test"/>
         *                      </div>
         *
         */
        var transclude = true,
            replace = true,
            template =  '<div class="hf-input-group"> '+
                            '<span class="hf-input-group-label add-on"><i class="icon-th fa fa-calendar"></i></span> '+
                        '</div>',
            link = function ($scope,$e,$attrs) {
                var $target = $("<hf-datetime></hf-datetime>"),
                    $source = $e;

                _directiveUtl.removeWrapAttr($attrs,$source,$target);
                // _hf.eachMap($attrs.$attr,function (k,v) {
                //     if(!_hf.startWith(v,"ng-") && !_hf.startWith(v,"hf-")){
                //         // 保留属性
                //         if(_hf.startWith(v,"w-")){
                //             $source.attr(v.substring("w-".length),$attrs[k]);
                //             $source.removeAttr(v);
                //         }else if(_hf.startWith(v,"hng-")){
                //             $target.attr(v.substring("h".length),$attrs[k]);
                //             $source.removeAttr(v);
                //         }
                //         else{
                //             $target.attr(v,$attrs[k]);
                //             $source.removeAttr(v);
                //         }
                //     }
                // });

                $e.append($target);
                var $ce = $compile($e.html())($scope.$parent);
                $e.html("").append($ce);
            }
        ;
        return {
            restrict:           "E",
            scope:              {},
            transclude:         transclude,
            template:           template,
            replace:            replace,
            link:               link
        };
    }]);
})(jQuery,angular);