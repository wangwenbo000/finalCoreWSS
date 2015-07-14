/**
 * 项目里的Controller基类
 * 这里做一些通用的处理逻辑，其他Controller继承该类
 * @param  {[type]}
 * @return {[type]}         [description]
 */
module.exports = Controller(function(){
  'use strict';
  return {
    indexAction: function(){
      var self = this;
      var OAuth = require('wechat-oauth');
      var appid = 'wxde2277be54c81c1d';
      var secret = '5cdd015be8db790c01b98d7a980397b6';
      var client = new OAuth(appid,secret);
      var getCode = self.get('code');
      var getState = self.get('state');
      // if(getState=='index'){
      //   getState = 'index?showwxpaytitle=1';
      // }
      var url = 'http://www.izaoan.cn/'+getState;

      client.getAccessToken(getCode, function (err, result) {
        var accessToken = result.data.access_token;
        var openid = result.data.openid;

        return D('Users').where({'openid':openid}).countSelect().then(function(data){
          if(data.count==1){
            self.session('userInfo',data.data[0]);
            // return self.assign('userInfo',data.data[0]);
          }
          // else{
            // 做一个存储数据库的操作
            // 并将信息存储到session
            // client.getUser(openid, function (err, result){
            //   var userInfo = result;
            //   return D('Users').add({
            //
            //   }).then(function(){
            //
            //   });
            // });
          // }
      }).then(function(){
        self.redirect(url);
      })
    });
    }
  }
})
