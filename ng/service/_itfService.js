/**
 * 接口工具函数服务
 */
;(function(angular){
  angular.module('hfBaseModule')
    .factory('_itf',
            ["_hf","$q",
    function( _hf , $q){

      var warp = function(http){
        var q = $q.defer();
        http
          .then(function(rst){
            if(_hf.isSucRst(rst)){
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
        warp:                       warp
      };

    }])
  ;

})(angular);
