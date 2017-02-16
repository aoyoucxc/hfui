/**
 * 接口工具函数服务
 */
;(function(angular){
  angular.module('hfBaseModule')
    .factory('_itf',
            ["_hf","$q",
    function( _hf , $q){

      /**
       * 是否是成功返回的结果,需要后台遵循
       *  {ret_code:'...',ret_msg:'...'}
       * @param rst
       * @return {*|boolean}
       */
      var isSucRst = function(rst){
        return (rst && rst.data && rst.data.ret_code && (rst.data.ret_code + "") === "200");
      };

      /**
       * 设置判断接口是否成功返回的判断函数
       * @param fn 接口是否成功返回的判断函数
       */
      var setSucRstFn = function (fn) {
        isSucRst = fn;
      };

      /**
       * 对请求后的结果进行初步的判断
       * @param http
       * @return {Promise}
       */
      var warp = function(http){
        var q = $q.defer();
        http
          .then(function(rst){
            if(isSucRst(rst)){
              q.resolve(rst.data);
            }else{
              console.error("rst",rst);
              q.reject("服务器出现一点小状况!");
            }
          },function(error){
            console.error(error);
            q.reject("网络出现一点小状况!");
          })
        ;
        return q.promise;
      };

      return {
        warp:                       warp,
        isSucRst:                   isSucRst,
        setSucRstFn:                setSucRstFn
      };

    }])
  ;

})(angular);
