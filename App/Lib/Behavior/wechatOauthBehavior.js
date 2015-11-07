/**
 * Created by wangwenbo on 15/11/7.
 */
module.exports = Behavior(function () {
  var Q = require('q');
  var request = require('request-promise');

  //微信配置信息
  var appid = 'wxde2277be54c81c1d';
  var secret = '5cdd015be8db790c01b98d7a980397b6';

  var redirect_uri = 'http%3a%2f%2fsuperset.imwork.net%2f';
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_userinfo#wechat_redirect'


  return {
    run: Q.async(function*() {
      console.log(this.http);
      var http = this.http;
      var code = http.get;
      console.log(code);
      if ('Home' == http.group) {
        if (isEmpty(code)) {
          http.res.writeHead(302, {'Location': url});
          console.log("A")
        } else {
          var webToken_option = {
            url: 'https://api.weixin.qq.com/sns/oauth2/access_token',
            qs: {
              appid: appid,
              secret: secret,
              code: code,
              grant_type: 'authorization_code'
            },
            method: 'GET'
          };
          var WEB_TOKEN = yield request(webToken_option);
          WEB_TOKEN = JSON.parse(WEB_TOKEN);

          var userInfo_option = {
            url: 'https://api.weixin.qq.com/sns/userinfo',
            qs: {
              access_token: WEB_TOKEN.access_token,
              openid: WEB_TOKEN.openid,
              lang: 'zh_CN'
            },
            method: 'GET'
          };
          var userInfo = yield request(userInfo_option);
          userInfo = JSON.parse(userInfo);

          yield this.session('userInfo',userInfo);

        }
      }
    })
  }
})