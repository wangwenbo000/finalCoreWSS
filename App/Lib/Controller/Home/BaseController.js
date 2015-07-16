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

      var OAuth = require('wechat-oauth');
      var appid = 'wxde2277be54c81c1d';
      var secret = '5cdd015be8db790c01b98d7a980397b6';
      var state = http.controller;
      var client = new OAuth(appid,secret);

      var scope = 'snsapi_userinfo';
      var redirect_uri = 'http://www.izaoan.cn/Oauth';
      var url = client.getAuthorizeURL(redirect_uri, state, scope);

      

      S('access_token').then(function(value){
        if(isEmpty(value)){
          console.log('token缓存是空的');
            WX_getToken();
        }else {
          console.log('token缓存并不是空的');
          return value;
        }
      }).then(function(data){
        S('jsapi_ticket').then(function(value){
          if(isEmpty(value)){
            console.log('获取ticket');
            WX_getJsapi_ticket(data);
          }
        })
      }).then(function(){
        return self.session('userInfo').then(function(data){
          if(isEmpty(data)){
            self.redirect(url);
          }
        });
      });
    }
  }
})
