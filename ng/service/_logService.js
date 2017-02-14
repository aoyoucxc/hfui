/**
 * 日志相关服务
 * 特性:
 *  按级别输出日志。
 *
 */
// TODO 日志过滤器,支持文件名过滤,支持状态过滤,支持自定义过滤
// TODO 支持日志输出格式化输出(支持日期,文件名,行,函数名,状态,信息<异常堆栈>)
// TODO 封装日志的常用输出方式,支持自定义输出方式
// TODO 支持异步输出日志
angular.module('hfBaseModule')
  .provider('_lg',function(){
    /**
     * 日志等级 close,debug,info,warn,error分别用数字0,1,2,3,4
     * close是关闭所有的日志
     */
    var CLOSE = 0;
    var DEBUG = 1;
    var INFO = 2;
    var WARN = 3;
    var ERROR = 4;


    // 默认输出级别
    var LEVEL = DEBUG;
    // 执行lg("")的级别
    var LOF_LEVEL = INFO;
    // 是否异步输出日志
    var IS_ASYNC = 0;
    // 异步输出日志时最大的异步数
    var ASYNC_COUNT = 5;
    // 是否debug
    var IS_DEBUG = false;

    /**
     * 日志输出过滤器列表
     * 日志输出过滤器为一个函数,函数会传递当前日志信息,当前视图状态,日志开关
     * 过滤器需要返回一个数字,其中1代表输出日志,0不输出,-1忽略这个日志,让其他的过滤器去决定
     * 过滤器按注册顺序执行,后续的能影响前面过滤器的结果
     * 设置LEVEL输出级别的日志会默认为第一个过滤器
     * 设置LEVEL为CLOSE将会忽略所有的过滤器
     */
    var filterList = [];

    /**
     * 日志格式器
     */
    var formatter;

    /**
     * 追加器队列
     * 该队列中每个对象用于输出日志,日志会分发到这些追加器中,复制分发
     * 每个追加器为一个函数,参数为当前需要发送的日志,需要返回一个angularjs promise对象
     * @type {Array}
     *
     */
    var appenderList = [];

    /*======基础utl函数=========*/
    var _debug = function(e){
      if(e instanceof Error)
        e = e.message;
      console.log(e);
    };
    /**
     * 将 日期 转化为指定格式的String
     * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
        可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * eg:
     * fmtDate(new Date(),"yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
     * fmtDate(new Date(),"yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
     * fmtDate(new Date(),"yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
     * fmtDate(new Date(),"yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
     * fmtDate(new Date(),"yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
     */
    var fmtDate = function(date,fmt){
      var o = {
        "M+" : date.getMonth()+1, //月份
        "d+" : date.getDate(), //日
        "h+" : date.getHours()%12 === 0 ? 12 : date.getHours()%12, //小时
        "H+" : date.getHours(), //小时
        "m+" : date.getMinutes(), //分
        "s+" : date.getSeconds(), //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S" : date.getMilliseconds() //毫秒
      };
      var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
      };
      if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
      }
      if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[date.getDay()+""]);
      }
      for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
      }
      return fmt;
    };

    /*======一些配置========*/
    var layoutConfig = {
      layout : 'D{yyyy-MM-dd hh:mm:ss.S} M'
    };

    return {
      configLog:function(config){

      },
      $get : ["$state","$q",function($state,$q){
        /*=====内置对象======*/
        // 构建默认的控制台输出器
        var consoleAppender = function(log){
          var deferred = $q.defer();
          console.log(log);
          deferred.resolve();
          return deferred.promise;
        };

        /**
         * layout格式器
         * layout如果设置为JSON的话,直接log对象转为JSON
         * 如果设置为OBJECT的话,直接返回log对象
         * 其他字符串的话会进行解析其中L代表地址,l代表行号,C代表列号,f代表调用函数,F代表文件名,
         *  S代表当前页面状态,L代表日志等级,M代表日志信息
         *  D(D{日期格式})
         * 默认为 D{yyyy-MM-dd hh:mm:ss.S} <L> M
         * 关于日期格式的说明请看fmtDate函数,默认为 yyyy-MM-dd hh:mm:ss.S
         */
        var layoutFormatter = function(log){
          var layout = layoutConfig.layout;
          if(layout === "JSON")
            return JSON.parse(log);
          if(layout === "OBJECT")
            return log;
          else{
            // TODO 当前有bug,如functionName转化之后有L的话,那么会影响location的转化
            // 转换data
            var indexD = layout.indexOf("D");
            var count = 2000;
            while(indexD !== -1 && count > 0){
              var startStr = layout.substring(indexD+1,indexD+2);
              var fmtStr = "yyyy-MM-dd hh:mm:ss";
              var reg = "D";
              if(startStr === "{"){
                var indexEnd = layout.indexOf("}",indexD);
                fmtStr = layout.substring(indexD+2,indexEnd);
                reg = "D{"+fmtStr+"}";
              }
              layout = layout.replace(reg,fmtDate(log.date,fmtStr));
              indexD = layout.indexOf("D");
              count--;
            }
            //  转化line
            layout = layout.replace(/l/g, log.line);
            // 转化column
            layout = layout.replace(/C/g, log.column);
            // 转化state
            layout = layout.replace(/S/g, log.state);
            // 转化functionName
            layout = layout.replace(/f/g, log.functionName);
            // 转化level
            layout = layout.replace(/L/g, log.level);
            // 转化fileName
            layout = layout.replace(/F/g, log.fileName);
            // 转化location
            layout = layout.replace(/L/g, log.location);
            // 转化msg
            layout = layout.replace(/M/g, log.msg);
            return layout;
          }
        };

        // 创建等级过滤器
        var levelFilter = function(log){
          var trans = function(level){
            return level === "DEBUG" ? DEBUG :
              level === "INFO" ? INFO :
                level === "WARN" ? WARN :
                  level === "ERROR" ? ERROR : CLOSE;
          };
          if(LEVEL === CLOSE) return 0;
          return trans(log.level) >= LEVEL ? 1 : 0;
        };
        filterList.push(levelFilter);

        /*=========功能函数=========*/

        /**
         * 处理日志
         * @param level 日志等级
         * @param msg 日志信息
         * @param error 异常
         */
        var handLog = function(level,msg,error){
          var location;
          try {
            throw new Error();
          } catch (e) {
            location= e.stack.replace(/Error\n/).split(/\n/)[2].replace(/^\s+|\s+$/, "");
          }
          var function_fileIndex = location.indexOf(" (");
          var column_line_index = location.lastIndexOf(":");
          var line_file_index = location.lastIndexOf(":",column_line_index-1);
          var column = location.substring(column_line_index+1,location.length-1);
          var line = location.substring(line_file_index+1,column_line_index);
          var functionName = location.substring(3,function_fileIndex);
          var fileName = location.substring(function_fileIndex+2,line_file_index);
          if(error && error instanceof Error)
            msg = (msg ? msg+":" : "")+error.stack();
          var date = new Date();
          var state = $state.current.name;
          var log = {
            location:location,
            column:column,
            line:line,
            functionName:functionName,
            fileName:fileName,
            date:date,
            state:state,
            level:level,
            msg:msg
          };
          if(IS_ASYNC === 1){
            logList.push(log);
            asyncHandLog();
          }else{
            outputLog(log);
          }
        };

        /**
         * 异步的处理日志
         */
        var logList = [];
        var asyncHandLog = function(){
          setTimeout(function () {
            if(ASYNC_COUNT<=0 || logList.length <= 0) return;
            ASYNC_COUNT --;
            var log = logList.shift();
            outputLog(log)
              .finally(function(){
                asyncHandLog();
                ASYNC_COUNT++;
              })
            ;
          },1);
        };

        /**
         * 输出日志
         * @param log 日志对象
         * @returns {Promise} 该Promise对象代表是否输出成功
         */
        var outputLog = function(log){
          var deferred = $q.defer();
          var isOutput = filterLog(log);
          if(isOutput){
            var fmtLog = formatLog(log);
            appendLog(fmtLog)
              .then(function(){
                deferred.resolve();
              },function(){
                if(IS_DEBUG){
                  if(angular.isString(fmtLog))
                    _debug("log record failed,log is:"+fmtLog);
                  else
                    _debug("log record failed,log is:"+JSON.stringify(log));
                }
                deferred.reject();
              })
            ;
          }
          return deferred.promise;
        };

        /**
         * 过滤日志,当前的日志会经过过滤队列
         * @param log 当前需要输出的日志
         * @returns {boolean} 忽略还是输出
         */
        var filterLog = function(log){
          var isLg = false;
          if(LEVEL === CLOSE) return false;
          angular.forEach(filterList,function(filter){
            var rst = filter(log);
            if(rst === 1)
              isLg = true;
            else if(rst === 0)
              isLg = false;
          });
          return isLg;
        };

        /**
         * 格式化日志
         * @param log 当前日志,如果没有配置转化器,将会采用layout转化器
         * @returns {*} 格式化后的日志
         */
        var formatLog = function(log){
          return formatter ? formatter(log) : layoutFormatter(log);
        };

        /**
         * 将日志
         * @param log
         * @returns {Promise}
         */
        var appendLog = function(log){
          if(appenderList.length > 0 ){
            var deferred = $q.defer();
            var count = appenderList.length;
            var success = function(){
              count --;
              if(count <= 0)
                deferred.resolve();
            };
            angular.forEach(appenderList,function(appender){
              appender(angular.copy(log))
                .then(success,function(){
                  deferred.reject();
                  if(IS_DEBUG)
                    _debug("append log failed! appender name is "+appender.name);
                })
              ;
            });
            return deferred.promise;
          }else
            return consoleAppender(angular.copy(log));
        };

        var debug = function(msg){
          handLog("DEBUG",msg);
        };

        var info = function(msg){
          handLog("INFO",msg);
        };

        var warn = function(msg){
          handLog("WARN",msg);
        };

        var error = function(msg,error){
          if(msg instanceof Error)
            handLog("ERROR","",msg);
          else
            handLog("ERROR",msg,error);
        };

        return {
          debug: debug,
          info: info,
          warn: warn,
          error: error,
          d:debug,
          i:info,
          w:warn,
          e:error
        };
      }]
    };
  })
;
