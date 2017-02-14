/**
 * 容器相关方法
 * 提供的容器有flash,app,page
 *   flash:为当前页面和下个页面有用,当在下个页面就会被清空,用于页面转化时参数的传递
 *   app:为整个页面的参数容器
 */
angular.module('hfBaseModule')
  .factory('_c',["$q",'$rootScope',function($q,$rootScope){

    // 当该改变页面的时候维护flash,page容器
    $rootScope.$on('$ionicView.enter', function (e) {
      flash.increaseAndClear();
      page.clear();
    });

    var page = {
      data:{}
    };

    /**
     * 清空page属性
     */
    page.clear = function(){
      page.data = {};
    };

    /**
     * 设置属性
     * @param key 键或者一个对象
     * @param value 当key为键时,value保存值
     */
    page.put = function(key,value){
      if(key && value)
        page.data[key] = value;
      else{
        var obj = key;
        for(var _key in obj){
          if(obj.hasOwnProperty(_key))
            page.data[_key] = page[_key];
        }
      }
    };

    /**
     * 获取属性
     * @param key 键
     * @param dft 默认值
     * @return {*} 值
     */
    page.get = function(key,dft){
      return page.data.hasOwnProperty(key) ? page.data[key] : dft;
    };

    // TODO keys,size,remove 4 page

    /**
     * flash容器
     */
    var flash = {
      data:{},
      length:0
    };

    /**
     * 设置属性
     * @param key 键或者一个对象
     * @param value 当key为键时,value保存值
     */
    flash.put = function(key,value){
      if(key && value){
        flash.length++;
        flash.data[key] = {
          value:value,
          count:0
        };
      }
      else{
        var obj = key;
        for(var _key in obj){
          if(obj.hasOwnProperty(_key)){
            flash.length++;
            flash.data[_key] = {
              value:obj[_key],
              count:0
            };
          }
        }
      }
    };

    /**
     * 增加属性的计数并且清除失效的属性
     */
    flash.increaseAndClear = function(){
      var data = flash.data;
      var invalidKeyList = [];
      for(var key in data){
        if(data.hasOwnProperty(key)){
          var count = data[key].count;
          if(count >= 1)
            invalidKeyList.push(key);
          else
            data[key].count = 1;
        }
      }
      for(var i = 0 ;i<invalidKeyList.length;i++){
        flash.length--;
        delete data[invalidKeyList[i]];
      }
    };

    /**
     * 获取属性
     * @param key 键
     * @param dft 默认值
     * @return {*} 值
     */
    flash.get = function(key,dft){
      return flash.data.hasOwnProperty(key) ? flash.data[key].value : dft;
    };

    /**
     * 将flash中的参数计数重置(这样下一个页面继续保留这些参数)
     */
    flash.reset = function(){
      var data = flash.data;
      for(var key in data){
        if(data.hasOwnProperty(key)){
          data[key].count = 0;
        }
      }
    };

    /**
     * 返回数据个数
     * @return {number}
     */
    flash.size = function(){
      return flash.length;
    };

    /**
     * 删除指定元素
     * @param key
     */
    flash.remove = function(key){
      var data = flash.data;
      delete data[key];
    };

    /**
     *  得到所有的key
     */
    flash.keys = function(){
      var data = flash.data;
      var keys = [];
      for(var key in data){
        if(data.hasOwnProperty(key)){
          keys.push(key);
        }
      }
      return keys;
    };


    /**
     *  app 容器
     *
     */
    var app = {
      data:{}
    };

    /**
     * 设置属性
     * @param key 键或者一个对象
     * @param value 当key为键时,value保存值
     */
    app.put = function(key,value){
      if(key && value)
        app.data[key] = value;
      else{
        var obj = key;
        for(var _key in obj){
          if(obj.hasOwnProperty(_key))
            app.data[_key] = obj[_key];
        }
      }
    };

    /**
     * 获取属性
     * @param key 键
     * @param dft 默认值
     * @return {*} 值
     */
    app.get = function(key,dft){
      return app.data.hasOwnProperty(key) ? app.data[key] : dft;
    };

    /**
     * 从容器中查找参数,低容器中找不到时会到高容器中找
     * @param key
     * @param dft
     */
    var get = function(key,dft){
      return page.data.hasOwnProperty(key) ? page.get(key) :
        flash.data.hasOwnProperty(key) ? flash.get(key) :
          app.data.hasOwnProperty(key) ? app.get(data) : dft;
    };



    // TODO keys,size,remove 4 app

    return {
      get:get,
      app:{
        put:app.put,
        get:app.get
      },
      flash:{
        put:flash.put,
        get:flash.get,
        reset:flash.reset,
        keys:flash.keys,
        remove:flash.remove,
        size:flash.size
      }
    };
  }])
;
