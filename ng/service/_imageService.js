/**
 * 图片相关工具函数
 */
angular.module('hfBaseModule')
  .factory('_image',["$q","$interval",
             function($q , $interval){

    /**
     *  将图片转为blob对象
     *  @param imageUrl  图片URL,可以是网络URL,也可以是本地地址,注意不能跨域
     *  @param rateNum 压缩倍数
     *  @
     */
    var img2Blob = function (imageUrl, rateNum) {
      rateNum = rateNum ? rateNum : 1 ;
      var deferred = $q.defer();
      var img = new Image();
      img.onerror = function(e){
        $q.reject(e);
      };
      img.onload = function () {
        var canvas = document.createElement('canvas');
        if(angular.isUndefined(canvas.toBlob))
          $q.reject(new Error("The canvas-to-blob.min.js is not imported!"));
        else{
          canvas.width = img.width;
          canvas.height = img.height;
          var width = img.width;
          var height = img.height;
          var ctx = canvas.getContext('2d');
          var rate = (1 / rateNum); //(width < height ? width / height : height / width) / 1;
          canvas.width = width * rate;
          canvas.height = height * rate;
          ctx.drawImage(img, 0, 0, width, height, 0, 0, width * rate, height * rate);
          canvas.toBlob(function(blob){
            deferred.resolve(blob);
          });
        }
      };
      img.src = imageUrl;
      return deferred.promise;
    };

    /**
     *  图片自适应容器。根据容器的宽高跟图片的原本高宽作为对比,计算出最佳的展示效果(图片全部展示出来且占容器的面积最大)
     * @param $img 图片的$对象
     * @param $target 容器的$对象
     * @param options 选项,可以配置三个回调函数。
     *    分别是:
     *      renderBefore($img,$target):渲染前执行;
     *      renderAfter($img,$target):渲染后执行;
     *      renderSize($img,$target,width,height):渲染时执行;
     * @return {boolean}
     */
    // TODO 封装为指令
    var adaptiveContainer =  function ($img,$target,options) {
      if(!$img || !$target ) return false;
      var that = this;
      var DEFAULTS = {
        renderBefore:function($img,$target){},
        renderAfter:function($img,$target){},
        renderSize:function($img,$target){}
      };
      options = angular.extend(DEFAULTS,options);
      var idDo = options.renderBefore.call(that,$img,$target);
      if(false === idDo){return false;}
      var $imgClone = $img.clone();
      var tmp_id = "hf_uuid_" + new Date().getTime();
      var $tmp = angular.element('<div id="'+tmp_id+'"></div>');
      $tmp.append($imgClone);
      angular.element(document).find("body").append($tmp);
      var _$imgClone = angular.element(document.getElementById(tmp_id)).find("img");
      _$imgClone.on("load",function(){
        var IW = _$imgClone[0].offsetWidth;
        var IH = _$imgClone[0].offsetHeight;
        var CW = $target[0].offsetWidth;
        var CH = $target[0].offsetHeight;
        var setSize = function(width,height){
          $img.css("width",width+"px");
          $img.css("height",height+"px");
          options.renderSize.call(that,$img,$target,width,height);
        };
        if(IW < CW && IH < CH){
          if(IW/IH > CW/CH){
            setSize(IW*(CH/IH),CH);
          }else{
            setSize(CW,IH*(CW/IW));
          }
        }else if(IW < CW && IH >= CH){
          setSize(CW,IH*(CW/IW));
        }else if(IW >= CW && IH < CH){
          setSize(IW*(CH/IH),CH);
        }else if(IW >= CW && IH >= CH){
          if(IW/IH > CW/CH){
            setSize(IW*(CH/IH),CH);
          }else{
            setSize(CW,IH*(CW/IW));
          }
        }
        options.renderAfter.call(that,$img,$target);
        angular.element(document.getElementById(tmp_id).remove());
      });
    };

   /**
    * 得到图片的高宽。
    * @param imgUrl 图片的URL
    * @param timeout 超时时间。默认1分钟。
    * @return {Promise}
    */
    var getImageWH = function(imgUrl,timeout){
      var deferred = $q.defer();
      var checkInterval = 40;
      timeout = timeout ? timeout : 60*1000; // 1min
      var count = timeout / checkInterval;
      // 创建对象
      var img = new Image();
      // 改变图片的src
      img.src = imgUrl;
      var check = function(){
        count -- ;
        if(img.width>0 || img.height>0){
          deferred.resolve({w:img.width,h:img.height});
          $interval.cancel(tmp);
        }
        if(count < 0){
          deferred.reject("超时");
          $interval.cancel(tmp);
        }
      };
      var tmp = $interval(check,checkInterval);
      return deferred.promise;
    };

    return {
      img2Blob:                     img2Blob,
      adaptiveContainer:            adaptiveContainer,
      getImageWH:                   getImageWH
    };

  }])
;



