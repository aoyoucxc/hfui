/**
 * 数据库相关操作方法
 * 当前版本使用的是html5 webSql作为数据库 TODO:后续使用crodova的sqlite插件
 * // TODO 使用自定义　lg,默认实现调用$log,但支持其他log
 */
angular.module('hfBaseModule')
  .factory('_db',['$q','$log',function($q,$log){
    // 常量
    var IOS_MAX_SIZE = 50 * 1024 * 1024;
    var META_TABLE = "hf_meta_table_201612211036";
    var log = {
      "debug":function(){
        // console.debug.apply(this,arguments);
      },
      "info":function(){
        //console.info.apply(this,arguments);
      },
      "warn":function () {
        //console.warn.apply(this,arguments);
      },
      "error":function(){
        //console.error.apply(this,arguments);
      },
      "log":function(){
        //console.log.apply(this,arguments);
      }
    };
    var CONFIG = {
      "tableList":[],  // 当前数据库中所有的表名列表,必选
      "oldTableList":[], // 数据库曾经拥有的表名列表,必选
      "size":1024 * 1024 * 1024, // 数据库最大的空间,可选
      "dbName":"localDB", // 数据库名字,可选
      "dbDesc":"local database", // 数据库名字,可选
      "currentVersion":0,// 必选,必须为数字
      "isInitDb":false, // 是否初始化数据库,可选
      "log":log, // 日志记录器,可选,默认使用$log记录
      /**
       * 初始化数据库,可选
       * @param db 当前数据库对象
       * @return {Promise} 必须返回一个promise对象
       */
      "initDb":function(db){
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      },
      /**
       * 处理数据库版本差异,必须返回一个,必选
       * @param oldVersion 老版本
       * @param db 当前数据库
       * @return {Promise} 必须返回一个promise对象
       */
      "handleVersionDiff":function(oldVersion,db){
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      }
    };

    var isReady = false; // 数据库是否准备好

    // 创建本地数据库，IOS兼容性问题，请勿超过50M
    var db;

    // 比较数据库差异,并调用处理函数
    var diffDbVersion = function(){
      if(!db) return;
      db.transaction(function (context) {
        executeQuery("SELECT COUNT(*) count FROM sqlite_master where type='table' and name=? ",[META_TABLE],context)
          .then(function(list){
            if(list[0].count <= 0)
              return create(META_TABLE,[
                'id PRIMARY KEY',
                'version',
                'col1','col2','col3','col4','col5','col6','col7','col8','col9','col10'
              ]);
          })
          .then(function(){
            return executeQuery("select version from "+META_TABLE+" where id = 1 ",[]);
          })
          .then(function(list){
            if(list.length > 0)
              return CONFIG.handleVersionDiff(list[0].version,db);
            else
              return insert(META_TABLE,{id:1,version:0})
                .then(function(){
                  return CONFIG.handleVersionDiff(0,db);
                });
          })
          .then(function(){
            return update(META_TABLE,{"version":CONFIG.currentVersion},{"id":1});
          })
          .then(function(){
            if(CONFIG.isInitDb)
              return CONFIG.initDb(db);
          })
          .then(function(){
            isReady = true;
            log.info("初始化数据库成功");
          },function(e){
            log.error(e);
          })
        ;
      },function(e){
        log.error("比较数据库差异,创建事务失败!",e);
      });
    };

    /**
     * 执行一个查询SQL
     * @param sql 执行的SQL
     * @param params 占位符参数
     * @param context 事务应用的上下文
     * @returns {Promise} 成功返回数据列表和context,失败返回错误和context
     */
    var executeQuery = function (sql,params,context) {
      log.debug("sql:"+sql+",parmas:"+JSON.stringify(params));
      var deferred = $q.defer();
      db.readTransaction(function (context) {
        context.executeSql(sql,params,function(ctx,rst){
          var list = [];
          var len = rst.rows.length;
          for(var i = 0 ; i < len ; i++){
            list.push(rst.rows.item(i));
          }
          deferred.resolve(list);
        },function(ctx,e){
          deferred.reject(e);
        });
      },function(e){
        deferred.reject(e);
      });
      return deferred.promise;
    };

    /**
     * 执行插入SQL
     * @param sql 执行的SQL
     * @param params 对应的占位符参数
     * @param context 事务上下文,可以为空,为空的话,改函数会自动启动一个事务
     * @returns {Promise} 成功返回一个executeUpdate success字符串和context,失败返回错误和context
     */
    var executeUpdate = function (sql,params) {
      log.debug("sql:"+sql+",parmas:"+JSON.stringify(params));
      var deferred = $q.defer();
      db.transaction(function (context) {
        context.executeSql(sql,params,function(){
          deferred.resolve("execute Success");
        },function(ctx,e){
          deferred.reject(e);
        });
      },function(e){
        deferred.reject(e);
      });
      return deferred.promise;
    };

    // TODO 支持批量执行SQL
    var sqlBatch = function(sqlList,context) {
      var deferred = $q.defer();
      deferred.resolve();
      return deferred;
    };

    var create = function(tableName,colList,isOver) {
      var sql = "CREATE TABLE ";
      if(isOver !== false)
        sql += "IF NOT EXISTS ";
      sql += ( tableName + "( ");
      var symbol = ", ";
      angular.forEach(colList,function(col,index){
        sql += (col + symbol);
      });
      sql = sql.substr(0,sql.length-symbol.length) + ")";
      return executeUpdate(sql,[]);
    };

    /**
     * 往数据库中插入一条记录
     * @example insert("student",{id:1,name:"joyer",age:12}).then(...);
     * @param obj 插入的对象,改对象的属性名对应表的名字
     * @param tableName 表明
     * @returns {Promise} 成功返回一个executeUpdate success字符串
     */
    var insert = function(tableName,obj) {
      var sql = "INSERT INTO "+tableName+" (";
      var valueList = [];
      var symbol = ", ";
      for(var name in obj){
        if(obj.hasOwnProperty(name)){
          sql  = sql + name +symbol;
          valueList.push(obj[name]);
        }
      }
      sql = sql.substr(0,sql.length-symbol.length) + ") values(";
      for(var i =0 ;i<valueList.length;i++){
        sql += "?,";
      }
      sql = sql.substr(0,sql.length-1)+")";
      return executeUpdate(sql,valueList);
    };

    /**
     * 删除一个表记录
     * @example remove("student","studentName","joyer").then(...);
     *          remove("student","studentName = ? and age > ?",["joyer",12]).then(...);
     *          remove("student",{studentName:"joyer",age:function(){return 12;}}).then(...);
     * @param tableName 表名
     * 关于后两个参数,总共有idFiled,id或者whereSql,valueList或者obj,cb这三种情况
     * 1:
     *  @param arg1 字符串,id字段名
     *  @param arg2 id的值
     * 2:
     *  @param arg1 where条件的sql,开头不需要where
     *  @param arg2  占位符列表
     * 3:
     *  @param arg1 移除条件对象,对象的key代表字段,对象的值代表条件值,值支持函数,但暂不支持返回promise的对象。TODO 支持promise对象
     * @returns {Promise} 成功返回一个executeUpdate success字符串
     */
    var remove = function(tableName,arg1,arg2){
      var sql = "DELETE FROM "+tableName+" WHERE ";
      var valueList = [];
      // 第二种情况
      if(typeof arg1 == "string" && (arg2 && typeof arg2 ==='object' && Array == arg2.constructor) ) {
        sql = sql + arg1;
        valueList = arg2;
      }
      // 第一种情况
      else if(typeof arg1 == "string"){
        sql = sql + arg1 + "= ?";
        valueList.push(arg2);
      }
      // 第三种情况
      else {
        var symbol = " and ";
        for(var key in arg1){
          if(arg1.hasOwnProperty(key)){
            sql = sql + key + " = ? "  + symbol;
            var value = angular.isFunction(arg1[key]) ? arg1[key]() : arg1[key];
            valueList.push(arg1[key]);
          }
        }
        sql = sql.substr(0,sql.length-symbol.length);
      }
      return executeUpdate(sql,valueList);
    };

    /**
     * 修改
     * @example update("student",{name:"joyer"},{id:123}).then(...); // 将id为123的学生的名字修改为joyer
     *          update("student",{name:"joyer"}).then(...); // 将所有的学生的名字修改为joyer
     *          update("student",{name:"joyer"},"id = ?",[123]).then(...); // 将id为123的学生的名字修改为joyer
     * @param tableName 表名
     * @param obj 需要修改的值,Map对象,key为字段名,value为值
     * @param where 条件,可以为map对象,也可以是一个没有where开头的条件sql
     * @param params 如果where为sql,那么params就为占位符参数
     * @returns {Promise} 成功返回一个executeUpdate success字符串
     */
    var update = function(tableName,obj,where,params){
      var sql = "UPDATE "+tableName + " SET ";
      var symbol = " , ";
      var valueList = [];
      for(var key in obj){
        if(obj.hasOwnProperty(key)){
          sql = sql +( key + " = ? " + symbol);
          valueList.push(obj[key]);
        }
      }
      sql = sql.substr(0,sql.length-symbol.length);
      if(typeof(where)=="string"){
        sql = sql + " WHERE ";
        sql = sql + where;
        if(params){
          for(var i = 0;i<params.length;i++){
            valueList.push(params[i]);
          }
        }
      }else if(where){
        sql = sql + " WHERE ";
        var _symbol = " AND ";
        for(var _key in where){
          if(where.hasOwnProperty(_key)){
            sql = sql +( _key +" = ? "+ _symbol);
            valueList.push(where[_key]);
          }
        }
        sql = sql.substr(0,sql.length-_symbol.length);
      }
      return executeUpdate(sql,valueList);
    };

    /**
     * 删除表格
     * @example
     *  clearTable("student1") // 不删除表结构,只清空三个表
     * @param tableName 一个表名
     * @param isDrop 是否删除表格结构
     * @returns {Promise} 成功返回一个executeUpdate success字符串
     */
    var clearTable = function(tableName,isDrop) {
      if(!angular.isArray(tableName)){
        tableName = [tableName];
      }
      var sql;
      if(isDrop)
        sql = "DROP TABLE ";
      else
        sql = "DELETE FROM ";
      var count = 0;
      sql += tableName[count];
      return executeUpdate(sql,[]);
    };

    return {
      /**
       * 配置数据库,改方法必须在使用数据库方法之前调用,不然所有其他数据库操作都将失效
       * @param conf
       */
      "config":function(conf){
        CONFIG = angular.extend(CONFIG,conf);
        CONFIG.size = CONFIG.size > IOS_MAX_SIZE ? IOS_MAX_SIZE : CONFIG.size;
        db = openDatabase(CONFIG.dbName, '1.0', CONFIG.dbDesc,CONFIG.size);
        diffDbVersion();
      },
      /**
       * 返回当前数据库
       * @return {*}
       */
      "db":function(){
        return db;
      },
      /**
       * 获取版本的所有表格
       * @return {Array}
       */
      "tables":function(){
        var _tables = [];
        angular.forEach(CONFIG.tableList,function(item,index){
          _tables.push(item);
        });
        return _tables;
      },
      /**
       * 获取历史版本上的所有表格
       * @return {Array}
       */
      "oldTables":function(){
        var _oldTables = [];
        angular.forEach(CONFIG.oldTableList,function(item,index){
          _oldTables.push(item);
        });
        return _oldTables;
      },
      /**
       * 当前数据库是否初始化
       * @return {boolean}
       */
      "isReady":function(){
        return isReady;
      },
      /**
       * 执行查询
       */
      "executeQuery": executeQuery,
      /**
       * 执行修改
       */
      "executeUpdate": executeUpdate,
      /**
       * 插入一条记录
       */
      "insert":insert,
      /**
       * 删除一条记录
       */
      "remove":remove,
      /**
       * 修改一条记录
       */
      "update":update,
      /**
       * 清除一个或者多个表格,支持删除表结构
       */
      "clearTable":clearTable,
      /**
       * 创建一个表
       */
      "create":create
    };
  }])
;
