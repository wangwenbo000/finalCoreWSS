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

      // var OAuth = require('wechat-oauth');
      // var appid = 'wxde2277be54c81c1d';
      // var secret = '5cdd015be8db790c01b98d7a980397b6';
      // var client = new OAuth(appid,secret);



      // self.session('openid','o510Kj_ydZPIMQdl1jww5w9MecQk');
    }
  }
})
