/**
 * url操作相关函数
 */
angular.module('hfBaseModule')
  .factory('_url',["_hf",
          function(_hf){
      var urlList = [];

      var urlMap = {};

      /**
       * 放入一个URL
       * @param name 这个URL的名字,同名会被覆盖
       * @param url URL的URL值
       * @param isNeedValid 是否需要登录验证,默认为true
       * @param role 权限对象 ,默认为{}
       */
      urlMap.register = function(name,url,isNeedValid,role){
        isNeedValid = isNeedValid !== false;
        role = _hf.extend({},role);
        var urlObj = {
          name:name,
          url:url,
          isNeedValid:isNeedValid,
          role:role
        };
        urlList.push(urlObj);
        urlMap[name] = urlObj;
        urlMap[name+"Name"] = name;
        urlMap[name+"Url"] = url;
        urlMap[name+"Inv"] = isNeedValid;
        urlMap[name+"Role"] = role;
      };

      urlMap.url = function(urlName,urlParams){
        var url;
        if(urlMap[urlName]) url = urlMap[urlName].url;
        if(url && urlParams){
          for(var key in urlParams){
            if(urlParams.hasOwnProperty(key)){
              var paramsValue = urlParams[key];
              url = _hf.replaceAll(url,"{{"+key+"}}",paramsValue);
            }
          }
        }
        return url;
      };

      urlMap.needValid = function (urlName) {
        var isNeedValid = false;
        angular.forEach(urlList,function(item){
          if(!isNeedValid && item.name === urlName && item.isNeedValid){
            isNeedValid = true;
          }
        });
        return isNeedValid;
      };

      return urlMap;

    }])
;
