/**
 * hscf工具函数
 */
;(function(){
  angular.module('hfBaseModule')
    .factory('_hf',["$q",function($q){

      // 数学相关(包括数字)
      var mathUtl = {};

      /**
       * 得到一个随机整数
       * @param start 起始数字,包括
       * @param end 截止数字,不包括
       * @return {number}
       */
      mathUtl.nextRndInt = function(start,end){
        return Math.floor(Math.random()*(end-start)+start);
      };

      // 对象相关
      var objUtl = {};

      /**
       * 判断对象是否是异常
       * @param obj
       * @return {boolean}
       */
      objUtl.isError = function(obj){
        return obj instanceof Error;
      };

      /**
       * 将对象序列化为字符串
       * @param obj
       */
      objUtl.str = function(obj){
        return JSON.stringify(obj);
      };

      /**
       * 说呢过程呢个UUID,理想状况下是全网唯一,但重复的概率并不为0,在不设置len,radix情况下复合rfc4122规范(有"-")
       * @param len 长度,默认为32
       * @param radix 基数,默认为42
       * @return {string}
       */
      objUtl.uuid = function(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
          // Compact form
          for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
          // rfc4122, version 4 form
          var r;

          // rfc4122 requires these characters
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
          uuid[14] = '4';

          // Fill in random data.  At i==19 set the high bits of clock sequence as
          // per rfc4122, sec. 4.1.5
          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random()*16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
        }
        return uuid.join('');
      };

      /**
       * 将生成的UUID加上时间戳,保证由该方法生成的UUID唯一
       * @param len 长度,默认为32
       * @param radix 基数,默认为42
       * @return {string}
       */
      objUtl.timeUuid = function(){
        return new Date().getTime() + objUtl.uuid(32);
      };

      /**
       * 遍历map
       * @param map 需要遍历的map
       * @param fn 回调函数,调用方式fn(key,value),key为每次遍历map的键,value为每次遍历map的值
       */
      objUtl.eachMap = function (map,fn) {
        for(var key in map){
          if(map.hasOwnProperty(key)){
            fn(key,map[key]);
          }
        }
      };

      /**
       * 判断参数是否为true(boolean,string)
       * @param obj
       * @return {boolean}
       */
      objUtl.isTrue = function (obj) {
        return obj + "" === "true";
      };

      /**
       * 判断参数是否为false(boolean,string)
       * @param obj
       * @return {boolean}
       */
      objUtl.isFalse = function(obj) {
        return obj + "" === "false";
      };

      // 字符相关
      var strUtl = {};

      /**
       * 替换所有匹配的字符串
       * @param str 被替换的字符串
       * @param reg 匹配文字,将会被封装为/reg/g
       * @param rep 替换字符串
       * @returns 替换后字符串
       */
      strUtl.replaceAll = function (str,reg,rep) {
        return str.replace(new RegExp(reg,"gm"),rep);
      };

      /**
       * 字符串是否以某个字符串开始
       * @param str 需要判断的字符串
       * @param match 匹配的字符串
       * @return {boolean}
       */
      strUtl.startWith = function (str,match) {
        if(!match || ! str || match === null||match === ""||str.length === 0||match.length>str.length)
          return false;
        return str.substr(0,match.length)==match;
      };

      /**
       * 字符串是否以某个字符串结束
       * @param str 需要判断的字符串
       * @param match 匹配的字符串
       * @return {boolean}
       */
      strUtl.endWidth = function (str,match) {
        if(!match || ! str ||  match === null||match === ""||str.length === 0||match.length>str.length)
          return false;
        return str.substring(str.length-match.length)==match;
      };

      /**
       * 去除字符串两端的空格
       * @param str 需要去空的字符串
       * @return {*}
       */
      strUtl.trim = function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
      };

      /**
       * 去除字符串前面的空格
       * @param str 需要去空的字符串
       * @return {*}
       */
      strUtl.ltrim = function (str) {
        return str.replace(/(^\s*)/g,"");
      };

      /**
       * 去除字符串后面的空格
       * @param str 需要去空的字符串
       * @return {*}
       */
      strUtl.rtrim = function (str) {
        return this.replace(/(\s*$)/g,"");
      };

      /**
       * 切割字符串
       * eg:
       *   sliceStr("/a/b/c/d/e/f/g.txt","/",1,true) ==>
       *   sliceStr("/a/b/c/d/e/f/g.txt","/",2,true) ==> /a
       *   sliceStr("/a/b/c/d/e/f/g.txt","/",3,true) ==> /a/b
       *   sliceStr("/a/b/c/d/e/f/g.txt","/",4,true) ==> /a/b/c
       *   sliceStr("/a/b/c/d/e/f/g.txt","/",5,true) ==> /a/b/c/d
       * @param str 需要切割的字符串
       * @param slice 作为切割点的字符串
       * @param no 作为切割点的字符串出现的字数,可以为负数,负数代表从字符串后面算起
       * @param font 返回字符串的前半段还是后半段,true为前半段
       * @return {*}
       */
      strUtl.sliceAt = function(str,slice,no,font){
        if(no === 0 || !str || !str) return null;
        var length = str.length,
          sliceLength = slice.length,
          reverse = no < 0;
        no = Math.abs(no);
        var indexFn = reverse ? "lastIndexOf" : "indexOf",
          count = 0,
          index = reverse ? length + sliceLength : 0 - sliceLength,
          ins = reverse ? 0 - sliceLength : sliceLength;
        while(count < no){
          count ++;
          index = str[indexFn](slice,index + ins);
          if( index === - 1) break;
        }
        if(index == -1) return null;

        return font ? str.substr(0,index) : str.substr(index + sliceLength,length);
      };

      // 数组相关
      var arrayUtl = {};

      /**
       * 符合条件的第一个元素的下标,如果都不符合,返回-1
       * @param list
       * @param queryFn
       */
      arrayUtl.indexOf = function(list,queryFn) {
        var _index = -1;
        angular.forEach(list,function(item,index){
          if(_index === -1)
            _index = queryFn(item) ? index : _index;
        });
        return _index;
      };

      /**
       * 删除列表中指定的项,是否需要删除主要判断queryFn的返回值
       * @param list 需要删除的列表
       * @param queryFn 判断函数,参数是list的每一项,当返回true时删除该项,或者返回promise,并且该promise的状态为resolve的项会被删除
       * @param cb 删除所有需要删除的项后的会回调函数,参数为删除的下标集合
       */
      arrayUtl.remove = function(list,queryFn,cb) {
        var indexList = [];
        var count = 0;
        var removeItem = function(){
          if(count === list.length){
            if(cb) cb(indexList);
            angular.forEach(indexList,function(item,index){
              list.splice(item-index, 1);
            });
          }
        };
        angular.forEach(list,function(item,index){
          var rst = queryFn(item,index);
          if(rst === true){
            count ++;
            indexList.push(index);
          }
          else if(rst && rst.constructor === $q.defer().promise.constructor){
            (function(_index){
              rst.then(function () {
                indexList.push(_index);
              }).finally(function(){
                count ++;
                removeItem();
              });
            })(index);
          }else
            count++;
          removeItem();
        });
      };

      /**
       * 数组是否不为空
       * @param list
       * @return {*|boolean}
       */
      arrayUtl.notEmpty = function(list){
        return angular.isArray(list) && list.length > 0;
      };

      /**
       * 数组是否为空
       * @param list
       * @return {*|boolean}
       */
      arrayUtl.isEmpty = function(list){
        return !arrayUtl.notEmpty(list);
      };

      /**
       * 将一个数组添加到另一个数组中
       * @param srcList 添加到的数组
       * @param list 被添加的数组
       * @param flagFn 判断条件,为一个函数,返回true添加,返回false不添加,参数为被添加数组的每一项
       */
      arrayUtl.addAll = function(srcList,list,flagFn){
        angular.forEach(list,function(item){
          var _flagFn = flagFn ? flagFn(item) : true;
          if(_flagFn)
            srcList.push(item);
        });
      };

      /**
       * 从尾到头的遍历
       * @param array 需要遍历的数组
       * @param iteratee 遍历函数,会传递item,index,分别代表遍历当前项和当前项下标
       */
      arrayUtl.forEachLast = function(array,iteratee){
        var length = array.length;
        for(var i = length - 1 ; i >= 0 ; i--){
          iteratee(array[i],i);
        }
      };

      /**
       * 初始化一个指定长度的数组
       * @param size 需要初始化数组的长度
       * @param init 初始值,可以是值,也可以是一个回调函数,如果是回调函数的话,调用如下init(index)
       */
      arrayUtl.init = function (size,init) {
        var array = [];
        for(var i = 0;i<size;i++){
          if($.isFunction(init))
            array.push(init(i));
          else
            array.push(init);
        }
      };

      // angularJS相关
      var angularUtl = {};
      /**
       * 一步控制器,用于使用一个$q的promise对象管理多个异步块的场景
       * @param defer $q的promise对象
       * @param dftSuccessInfo 默认的成功信息
       * @param dftErrorInfo 默认的失败信息
       * @returns 一个异步控制器对象,该对象中有increase(number),successCb(msg...),errorCb(error)方法
       */
      angularUtl.syncCtrl = function(defer,dftSuccessInfo,dftErrorInfo){
        var obj = {};
        obj.count = 0;
        obj.defer = defer;
        /**
         * 增加异步控制对象的资源个数,默认调用会添加1个
         * @param number
         */
        obj.increase = function(number){
          if(number === 0)
            number = 0;
          else
            number = number ? number : 1;
          obj.count = obj.count+number;
        };
        /**
         * 成功回调函数,当资源个数小于等于0时,会调用promise对象的resolve函数
         */
        obj.successCb = function() {
          obj.count = obj.count - 1;
          if(obj.count <= 0 ){
            if(arguments && arguments.length > 0)
              obj.defer.resolve.apply(this, arguments);
            else
              obj.defer.resolve.apply(this, dftSuccessInfo);
          }
        };
        /**
         * 失败回调函数,立即调用 promise对象的reject函数
         */
        obj.errorCb = function(){

          if(arguments && arguments.length > 0)
            obj.defer.reject.apply(this, arguments);
          else
            obj.defer.reject.apply(this, dftErrorInfo);
        };
        return obj;
      };

      /**
       * 判断当前对象是否是$Q的promise对象
       * @param obj
       */
      angularUtl.isPromise = function (obj) {
        return obj.constructor === $q.defer().promise.constructor;
      };

      /**
       * 返回一个立即执行的Promise
       * @return {Promise}
       */
      angularUtl.immediatelyPromise = function(){
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      };

      /**
       * 页面初始化时执行的操作
       * @param fn 回调函数
       */
      angularUtl.ready = function(fn){
        angular.element(document).ready(fn);
      };

      /**
       * jQuery的extend函数(不对DOM起作用),合并多个对象(angularjs的有坑,它返回的不是新的对象)
       * @return {{}}
       */
      angularUtl.extend = function(){
        var obj = {};
        for(var i =0; i < arguments.length; i++){
          var params = arguments[i];
          for(var key in params){
            if(params.hasOwnProperty(key))
              obj[key] = params[key];
          }
        }
        return obj;
      };

      /**
       * 安全的调用$scope.$apply
       * @param $scope 作用域
       * @param fn 需要执行的方法
       */
      angularUtl.safeApply = function($scope,fn){
        var phase = $scope.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
          if(fn && (typeof(fn) === 'function'))
            fn();
        }else
          $scope.$apply(fn);
      };

      /**
       * 文件相关
       */
      var fileUtl = {};

      /**
       * 根据文件的路径(或者URL)得到文件的类型
       * @param path
       * @return string 文件的类型,返回null代表判断不了
       */
      fileUtl.getTypeByPath = function(path) {
        var str = "";
        var index = path.lastIndexOf("\56");
        if(index != -1 && index < path.length)
          return path.substring(index+1,path.length);
        return null;
      };

      /**
       * 日期相关
       * @type {{}}
       */
      var dateUtl = {};

      dateUtl.SECOND = 1000;
      dateUtl.MINUTE = 60*dateUtl.SECOND;
      dateUtl.HOUR = 60*dateUtl.MINUTE;
      dateUtl.DAY = 24*dateUtl.HOUR;

      /**
       * 得到当前时间的时间戳
       * @return {number}
       */
      dateUtl.getNowTime = function(){
        return new Date().getTime();
      };

      /**
       * 格式化日期。将日期转化为指定格式的字符串
       * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
       * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
       * eg:
       *  fmt(new Date(),"yyyy-MM-dd hh:mm:ss.S")  ==> 2016-07-02 08:09:04.423
       *  fmt(new Date(),"yyyy-M-d h:m:s.S")  ==> 2016-7-2 8:9:4.423
       * @param date 需要格式化的数字
       * @param fmt 格式
       * @return {*}
       */
      dateUtl.fmt = function (date,fmt) { //author: meizz
        var o = {
          "M+": date.getMonth() + 1, //月份
          "d+": date.getDate(), //日
          "h+": date.getHours(), //小时
          "m+": date.getMinutes(), //分
          "s+": date.getSeconds(), //秒
          "q+": Math.floor((date.getMonth() + 3) / 3), //季度
          "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) :
            (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      };

      /**
       * 格式化日期。将日期转化为yyyy-MM-dd hh:mm:ss.S格式的字符串
       * @param date 需要格式化的数字
       * @return {*}
       */
      dateUtl.fmt_yyyyMMddhhmmssS = function (date) {
        return dateUtl.fmt(date,"yyyy-MM-dd hh:mm:ss.S");
      };

      /**
       * 格式化日期。将日期转化为yyyy-MM-dd格式的字符串
       * @param date 需要格式化的数字
       * @return {*}
       */
      dateUtl.fmt_yyyyMMdd = function (date) {
        return dateUtl.fmt(date,"yyyy-MM-dd");
      };

      // TODO java 的 Calandar

      /**
       * 网络相关(URL,AJAX,参数,返回值的擦偶走)
       * @type {{}}
       */
      var netUtl = {};

      /**
       * 是否是成功返回的结果,判断条件会肯句不同的系统有不同的变化,当前是根据CMS系统的接口协议判断的
       * @param rst
       * @return {*|boolean}
       */
      netUtl.isSucRst = function(rst){
        return (rst && rst.data && rst.data.ret_code && (rst.data.ret_code + "") === "200");
      };

      return {
        replaceAll:                           strUtl.replaceAll,
        startWith:                            strUtl.startWith,
        endWidth:                             strUtl.endWidth,
        trim:                                 strUtl.trim,
        ltrim:                                strUtl.ltrim,
        rtrim:                                strUtl.rtrim,
        sliceAt:                              strUtl.sliceAt,

        indexOf:                              arrayUtl.indexOf,
        remove:                               arrayUtl.remove,
        init:                                 arrayUtl.init,

        syncCtrl:                             angularUtl.syncCtrl,
        isPromise:                            angularUtl.isPromise,
        ready:                                angularUtl.ready,
        immediatelyPromise:                   angularUtl.immediatelyPromise,
        extend:                               angularUtl.extend,
        safeApply:                            angularUtl.safeApply,

        getTypeByPath:                        fileUtl.getTypeByPath,

        isError:                              objUtl.isError,
        str:                                  objUtl.str,
        uuid:                                 objUtl.uuid,
        timeUuid:                             objUtl.timeUuid,
        eachMap:                              objUtl.eachMap,
        isTrue:                               objUtl.isTrue,
        isFalse:                              objUtl.isFalse,

        isEmpty:                              arrayUtl.isEmpty,
        notEmpty:                             arrayUtl.notEmpty,
        addAll:                               arrayUtl.addAll,
        forEachLast:                          arrayUtl.forEachLast,

        nextRndInt:                           mathUtl.nextRndInt,

        fmt_yyyyMMddhhmmssS:                  dateUtl.fmt_yyyyMMddhhmmssS,
        fmt_yyyyMMdd:                         dateUtl.fmt_yyyyMMdd,
        fmt:                                  dateUtl.fmt,
        getNowTime:                           dateUtl.getNowTime,

        isSucRst:                             netUtl.isSucRst
      };
    }])
  ;
})();
