;(function($,angular) {
    'use strict';
    var m = angular.module('hfBaseModule');

    m.factory("_table",["_hf",function (_hf) {

        var Handler = function(config){
            var dft = {
                $e:             function () {},
                selectAll:      function () {},
                deselectAll:    function () {},
                toggle:         function () {}
            };
            this.config = _hf.extend(dft,config);
        };

        Handler.prototype.$e = function () {
            return this.config.$e();
        };

        Handler.prototype.selectAll = function () {
            this.config.selectAll();
        };

        Handler.prototype.deselectAll = function () {
            this.config.deselectAll();
        };

        Handler.prototype.toggle = function () {
            this.config.toggle();
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

        var $e = function () {
            if($current()) $current().$e();
        };

        /**
         * 表格全选
         */
        var selectAll = function () {
            if($current()) $current().selectAll();
        };

        /**
         * 表格全不选
         */
        var deselectAll = function () {
            if($current()) $current().deselectAll();
        };

        /**
         * 表格全选选择框切换
         */
        var toggle = function () {
            if($current()) $current().toggle();
        };

        return {
            $$push:                             $$push,
            $getByHandle:                       $getByHandle,
            $e:                                 $e,
            selectAll:                          selectAll,
            deselectAll:                        deselectAll,
            toggle:                             toggle
        };
    }]);

    m.directive("hfTable", ["_table",function(_table) {
        var scope = {
                // 是否有切割符
                split:         "@",
                // 是否有全选框
                checkbox:      "@"
            },
            transclude = true,
            template =  '<div class="hf-table-box"><table class="table hf-table table-hover" ' +
                'ng-class="{\'hf-table-split\':split+\'\' === \'true\'}" ng-transclude></table></div>',
            replace = true,
            controller = ["$scope","$element","$attrs","_table",function ($scope,$element,$attrs,_table) {
                $scope.moneyList = [];

                var _this = this,
                    handle = $attrs.delegateHandle;
                handle = handle ? handle : "dft";
                _table.$$push(handle,{
                    $e:             function () {
                        return $e;
                    },
                    selectAll:      function () {
                        _this.selectAll();
                        $element.find(".hf-table-checkall").prop("checked",true);
                    },
                    deselectAll:    function () {
                        _this.deselectAll();
                        $element.find(".hf-table-checkall").prop("checked",false);
                    },
                    toggle:         function () {
                        var $checkall = $element.find(".hf-table-checkall");
                        var checked = $checkall.prop("checked");
                        $checkall.prop("checked",!checked);
                        _this.toggle();
                    }
                });

                // 得到当前标签的jq对象
                this.$e = function () {
                    return $element;
                };
                // 表格是否需要分隔
                this.isSplit = function () {
                    return $scope.split+'' === 'true';
                };
                // 表格是否是否需要选中
                this.hasCheckbox = function () {
                    return  $scope.checkbox+'' === 'true';
                };
                /**
                 * 设置指定下标的表格列为金钱列
                 * @param index 下标,0开始
                 */
                this.setMoney = function (index) {
                    $scope.moneyList[index] = 1;
                };
                /**
                 * 判断指定下标的表格列是否为金钱列
                 * @param index 下标,0开始
                 */
                this.isMoney = function(index){
                    return $scope.moneyList[index] === 1;
                };
                // 选择所有表格
                this.selectAll = function () {
                    var $checked = $element.find("tr .hf-table-check");
                    $checked.each(function(checkboxIndex,checkbox){
                        var $checkbox = $(checkbox);
                        var checked = $checkbox.prop("checked");
                        checked = checked + "" === "true";
                        if(!checked)
                            $checkbox.trigger("click");
                    });
                };
                // 删除所有
                this.deselectAll = function () {
                    var $checked = $element.find("tr .hf-table-check");
                    $checked.each(function(checkboxIndex,checkbox){
                        var $checkbox = $(checkbox);
                        var checked = $checkbox.prop("checked");
                        checked = checked + "" === "true";
                        if(checked)
                            $checkbox.trigger("click");
                    });
                };
                // 切换表格全选状态
                this.toggle = function () {
                    var checked = $element.find(".hf-table-checkall").prop("checked");
                    if(checked)
                        this.selectAll();
                    else
                        this.deselectAll();
                };
            }],
            link = function($scope,$e,attrs){}
        ;
        return {
            restrict:       "E",
            scope:          scope,
            transclude:     transclude,
            template:       template,
            replace:        replace,
            controller:     controller ,
            link:           link
        };
    }]);

    m.directive("hfThead", [function() {
        var scope = {},
            transclude = true,
            template =  '<thead>' +
                '<tr ng-transclude></tr>' +
                '</thead>',
            replace = true,
            require = "^hfTable",
            link = function($scope,$e,$attrs,hfTableCtrl){
                var $tr = $e.find("tr");
                if(hfTableCtrl.hasCheckbox()){
                    $tr.prepend('<th style="width:40px;">' +
                        '<input type="checkbox" class="hf-table-checkall"></th>');
                    $tr.find(".hf-table-checkall").on("click",function(){
                        hfTableCtrl.toggle();
                    });
                }
                $tr.find("th").each(function (thIndex,th) {
                    var $th = $(th);
                    if($th.attr("money")+"" === "true"){
                        hfTableCtrl.setMoney(thIndex);
                    }
                });
            }
        ;
        return {
            restrict:           "E",
            scope:              scope,
            transclude:         transclude,
            template:           template,
            replace:            replace,
            require:            require,
            link:               link
        };
    }]);

    m.directive("hfTh", [function() {
        var scope = {
                // 当前列为金钱列
                money:          "@"
            },
            transclude = true,
            template =  '<th ng-transclude ng-class="{\'hf-money\':money}">记录类型</th>',
            replace = true
        ;
        return {
            restrict:           "E",
            scope:              scope,
            transclude:         transclude,
            template:           template,
            replace:            replace
        };
    }]);

    m.directive("hfTbody", [function() {
        return {
            restrict:           "E",
            transclude:         true,
            template:           "<tbody ng-transclude></tbody>",
            replace:            true
        };
    }]);

    m.directive("hfTr", ["_hf",function(_hf) {
        var scope = {
                // 选择框绑定的值
                checkoutValue:  "="
            },
            transclude = true,
            template =  '<tr ng-transclude></tr>',
            replace = true,
            require = "^hfTable",
            link = function($scope,$e,$attrs,hfTableCtrl){
                if(hfTableCtrl.hasCheckbox()){
                    $e.prepend('<td style="width:40px;"><input type="checkbox" class="hf-table-check"></td>');
                    $e.find(".hf-table-check").on("click",function () {
                        var _this = this;
                        _hf.safeApply($scope,function(){
                            $scope.checkoutValue = $(_this).prop("checked");
                        });
                    });
                }

                var watchCheckoutValue = $scope.$watch("checkoutValue",function(val){
                    $e.find(".hf-table-checkall").prop("checked",$scope.checkoutValue+"" === "true");
                });

                $e.find("td").each(function (thIndex,td) {
                    var $td = $(td);
                    if(hfTableCtrl.isMoney(thIndex)){
                        $td.addClass("hf-money");
                    }
                });

                $scope.$on("$destroy",function(){
                    watchCheckoutValue();
                });
            }
        ;
        return {
            restrict:           "E",
            scope:              scope,
            transclude:         transclude,
            template:           template,
            replace:            replace,
            require:            require,
            link:               link
        };
    }]);

    m.directive("hfTd", [function() {
        var scope = {
                // 当前单元格为金钱单元格
                money:          "@"
            },
            transclude = true,
            template =  '<td ng-transclude ng-class="{\'hf-money\':money}">记录类型</td>',
            replace = true
            ;
        return {
            restrict:           "E",
            scope:              scope,
            transclude:         transclude,
            template:           template,
            replace:            replace
        };
    }]);

})(jQuery,angular);



