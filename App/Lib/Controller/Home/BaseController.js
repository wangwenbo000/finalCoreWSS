/**
 * 项目里的Controller基类
 * 这里做一些通用的处理逻辑，其他Controller继承该类
 * @param  {[type]} 
 * @return {[type]}         [description]
 */
module.exports = Controller(function(){
  'use strict';
  return {
    init: function(http){
      this.super("init", http);
      var self = this;

      self.session('openid','o510Kj_ydZPIMQdl1jww5w9MecQk');

      return self.session('openid').then(function(data){
        if(isEmpty(data)){
          //微信auth请求开始
        }else{
          return D('Users').where({'openid':data}).countSelect().then(function(data){
            if(data.count){
              self.session('userInfo',data.data);
            }else{
              //做一个存储数据库的操作
              //并将信息存储到session
            }
          });
        }
      });
    }
  }
})