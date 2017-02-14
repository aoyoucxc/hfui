;(function(angular){
  "use strict";
  angular.module('hfBaseModule')
    .factory('_fileUpload',['$q',"$http","$timeout","_hf",
                    function($q , $http , $timeout , _hf){
      var statusT = {
        WAIT:       "WAIT",
        UPLOAD:     "UPLOAD",
        COMPLETE:   "COMPLETE",
        CANCEL:     "CANCEL",
        PAUSE:      "PAUSE",
        ERROR:      "ERROR"
      };

      var debug = false;

      var Upload = function(params){
        var that = this;
        that.currentThread = 0; // 当前上传线程数
        that.size = 0; // 文件总大小
        that.successed = 0; // 文件上传成功大小
        that.isPause = false; // 是否暂停
        that.packets = []; // 文件切片容器
        that.count = 0; // 总片数
        that.completeCount = 0; // 完成分片数量
        that.params = _hf.extend(that.DEFAULT,params); // 参数
        that.uuid = new Date().getTime();
        if(!that.params.isSync) that.params.threads = 1;
      };

      Upload.prototype.DEFAULT = {
        data:null,
        serve:null,
        isChunk:true,
        chunkSize: 1024*1024, // 1M
        isSync:false, // 是否并发
        threads:10, // 并发数
        resendTimes:5, // 重发次数
        doRequest:function(uploadPacket,count,size){},
        onProcess:function(uploaded,total){},
        onComplete:function(packets,uploaded,total){}
      };

      // 分片
      Upload.prototype.$chunk = function() {
        var that = this;
        var createPacket = function(number,slice){
          return {
            number:number,
            slice:slice,
            status:statusT.WAIT,
            size:slice.size,
            count:that.params.resendTimes
          };
        };
        if(that.params.isChunk){
          that.size = that.params.data.size;
          that.count = Math.ceil(that.size / that.params.chunkSize); // 总片数
          for(var i = 1;i <= that.count;i++){
            var start = (i-1) * that.params.chunkSize,
                end = Math.min(that.size, start + that.params.chunkSize);
            var slice = that.params.data.slice(start,end);
            that.packets.push(createPacket(i,slice));
          }
        }else{
          that.packets.push(createPacket(1,that.params.data));
        }
      };

       // 上传分片
      Upload.prototype.$uploadFileSlice = function(uploadPacket){
        var that = this;
        var deferred = $q.defer();
        uploadPacket.status = statusT.UPLOAD;
        that.params.doRequest(uploadPacket,that.count,that.size)
          // .then(function(req){
          //   return $http(req);
          // })
          .then(function(size){
            if(size == uploadPacket.size){
              $timeout(function(){
                deferred.resolve(uploadPacket);
              },700);
            }else{
              uploadPacket.errorMsg = "数据丢失";
              deferred.reject(uploadPacket);
            }
          },function(error){
            console.log(error);
            uploadPacket.errorMsg = error;
            deferred.reject(uploadPacket);
          })
        ;
        return deferred.promise;
       };

      Upload.prototype.$tmpSHow = function(){
        if(!debug) return;
        var WAIT = 0;
        var UPLOAD = 0;
        var COMPLETE = 0;
        var CANCEL = 0;
        var PAUSE = 0;
        var ERROR = 0;
        angular.forEach(this.packets,function(packet){
          if(packet.status == statusT.WAIT) WAIT++;
          if(packet.status == statusT.UPLOAD) UPLOAD++;
          if(packet.status == statusT.COMPLETE) COMPLETE++;
          if(packet.status == statusT.CANCEL) CANCEL++;
          if(packet.status == statusT.PAUSE) PAUSE++;
          if(packet.status == statusT.ERROR) ERROR++;
        });
        console.log("uuid:"+this.uuid+",length:"+this.packets.length+",WAIT:"+WAIT+",UPLOAD:"+UPLOAD+",COMPLETE:"+
          COMPLETE+",CANCEL:"+CANCEL+",PAUSE:"+PAUSE+",ERROR:"+ERROR+",currentThread"+this.currentThread);
      };

      // 上传
      Upload.prototype.$upload = function(){
        var that = this;
        if(that.currentThread >= that.params.threads ||
          that.isPause || that.completeCount >= that.packets.length) return false;
        // 找到需要上传的分片
        var uploadPacket = null;
        angular.forEach(that.packets,function(packet){
          if(!uploadPacket && packet.status === statusT.WAIT)
            uploadPacket = packet;
        });
        if(!uploadPacket) return false;
        that.currentThread ++;
        that.$uploadFileSlice(uploadPacket)
          .then(function(uploadPacket){
            if(uploadPacket.status == statusT.UPLOAD){
              uploadPacket.count--;
              uploadPacket.status = statusT.COMPLETE;
              that.completeCount ++;
              that.successed += uploadPacket.size;
              $timeout(function(){
                that.params.onProcess(that.successed,that.size);
              },0);
            }
          },function(uploadPacket){
            if(uploadPacket.status == statusT.UPLOAD){
              uploadPacket.count--;
              if(uploadPacket.count > 0){
                uploadPacket.status = statusT.WAIT;
                uploadPacket.errorMsg = "";
              }else{
                uploadPacket.status = statusT.ERROR;
                that.completeCount ++;
              }
            }
          })
          .finally(function(){
            if(that.completeCount >= that.packets.length)
              that.params.onComplete(that.packets,that.successed,that.size);
            that.$tmpSHow();
            that.currentThread --;
            that.$upload();
          })
        ;
        that.$upload();
      };

      // 上传
      Upload.prototype.upload = function(){
        var that = this;
        // 分片
        that.$chunk();
        // 上传
        that.$upload();
      };

      // 暂停
      Upload.prototype.pause = function(){
        var that = this;
        that.isPause = true;
        angular.forEach(that.packets,function(packet){
          if(packet.status === statusT.WAIT || packet.status === statusT.UPLOAD)
            packet.status = statusT.PAUSE;
        });
      };

      // 继续
      Upload.prototype.resume = function(){
       var that = this;
       angular.forEach(that.packets,function(packet){
         if(packet.status === statusT.PAUSE)
           packet.status = statusT.WAIT;
       });
       that.isPause = false;
       that.$upload();
      };

      // 取消
      Upload.prototype.cancel = function(){
        var that = this;
        angular.forEach(that.packets,function(packet){
          if(packet.status === statusT.WAIT || packet.status === statusT.UPLOAD)
            packet.status = statusT.CANCEL;
        });
      };

      return{
        Upload:Upload,
        UploadStatusT:statusT
      };
    }])
  ;
})(angular);
