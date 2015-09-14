/**
 * 项目里的Controller基类
 * 这里做一些通用的处理逻辑，其他Controller继承该类
 * @param  {[type]}
 * @return {[type]}         [description]
 */
module.exports = Controller(function(){
  'use strict';
  var Q = require('q');
  return {
    init: Q.async(function* (http){
      this.super("init",http);
      var rp = require('request-promise');

      var appid = 'wxde2277be54c81c1d';
      var secret = '5cdd015be8db790c01b98d7a980397b6';
      var state = http.controller;

      var scope = 'snsapi_userinfo';
      var redirect_uri = 'http%3A%2F%2Fwww.izaoan.cn%2FOauth';
      var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+redirect_uri+'&response_type=code&scope=snsapi_userinfo&state='+state+'#wechat_redirect'

      var TOKEN_options = {
        url:'https://api.weixin.qq.com/cgi-bin/token',
        qs:{grant_type:'client_credential',appid:'wxde2277be54c81c1d',secret:'5cdd015be8db790c01b98d7a980397b6'},
        method:'GET'
      }

      var access_token = yield S('access_token');
      var jsapi_ticket = yield S('jsapi_ticket');

      // access_token = '';

      if(isEmpty(access_token)||isEmpty(jsapi_ticket)){
        var getToken = yield rp(TOKEN_options);
        getToken = JSON.parse(getToken);

        var option = {
          url:'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
          qs:{access_token:getToken.access_token,type:'jsapi'},
          method:'GET'
        };

        S('access_token',getToken.access_token,{timeout:getToken.expires_in});

        var getJsapi_ticket = yield rp(option);
        getJsapi_ticket = JSON.parse(getJsapi_ticket);

        S('jsapi_ticket',getJsapi_ticket.ticket,{timeout:getJsapi_ticket.expires_in});
        console.log('请求一次口令');
      }

      var session_userinfo = yield this.session('userInfo');
      if(isEmpty(session_userinfo)){
        // yield this.redirect(url);
      }
    })
  }
});
