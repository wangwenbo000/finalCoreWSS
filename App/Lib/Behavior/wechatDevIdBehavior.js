/**
 * Created by wangwenbo on 15/11/7.
 */
module.exports = Behavior(function(){
  var Q = require('q');
  var request = require('request-promise');

  //微信配置信息
  var appid = 'wxde2277be54c81c1d';
  var secret = '5cdd015be8db790c01b98d7a980397b6';

  return {
    run: Q.async(function*() {
      var http = this.http;
      if('Home'==http.group){
        if(isEmpty(yield S('access_token'))){
          var TOKEN_options = {
            url:'https://api.weixin.qq.com/cgi-bin/token',
            qs:{
              grant_type:'client_credential',
              appid:'wxde2277be54c81c1d',
              secret:'5cdd015be8db790c01b98d7a980397b6'
            },
            method:'GET'
          }
          var TOKENID = yield request(TOKEN_options);
          TOKENID = JSON.parse(TOKENID);
          yield S('access_token',TOKENID.access_token,{timeout:TOKENID.expires_in});
        }
        if(isEmpty(yield S('jsapi_ticket'))){
          var TICKET_option = {
            url:'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
            qs:{
              access_token:TOKENID.access_token,
              type:'jsapi'
            },
            method:'GET'
          };
          var TICKETID = yield request(TICKET_option);
          TICKETID = JSON.parse(TICKETID);
          yield S('jsapi_ticket',TICKETID.ticket,{timeout:TICKETID.expires_in});
        }
      }
    })
  }
})