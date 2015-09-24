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
    indexAction: Q.async(function* (){
      var moment = require('moment');
      var rp = require('request-promise');
      var appid = 'wxde2277be54c81c1d';
      var secret = '5cdd015be8db790c01b98d7a980397b6';
      var getCode = this.get('code');
      var getState = this.get('state');
      var url = '/Home?showwxpaytitle=1';

      var step2_option = {
        url:'https://api.weixin.qq.com/sns/oauth2/access_token',
        qs:{appid:appid,
            secret:secret,
            code:getCode,
            grant_type:'authorization_code'
          },
        method:'GET'
      }

      var getWebAccessToken = yield rp(step2_option);
      getWebAccessToken = JSON.parse(getWebAccessToken);

      var step3_option_userInfo = {
        url:'https://api.weixin.qq.com/sns/userinfo',
        qs:{access_token:getWebAccessToken.access_token,
            openid:getWebAccessToken.openid,
            lang:'zh_CN'
          },
        method:'GET'
      }

      var userinfoJson = yield rp(step3_option_userInfo);
      userinfoJson = JSON.parse(userinfoJson);

      var selectUserInfo = yield D('Users').where({'openid':userinfoJson.openid}).select();
      if(!isEmpty(selectUserInfo)){
        selectUserInfo.face = userinfoJson.headimgurl;
        yield this.session('userInfo',selectUserInfo);
      }else{
        var addNewUserRowId = yield D('Users').add({
          openid        :userinfoJson.openid,
          username      :userinfoJson.nickname,
          sex           :userinfoJson.sex,
          language      :userinfoJson.language,
          location      :userinfoJson.city+','+userinfoJson.province+','+userinfoJson.country,
          face          :userinfoJson.headimgurl,
          subscribeTime :moment().format('X')
        });
        var afterAddAndSelect = yield D('Users').where({'id':addNewUserRowId}).select();
        if(!isEmpty(afterAddAndSelect)){
          afterAddAndSelect.face = userinfoJson.headimgurl;
          yield this.session('userInfo',afterAddAndSelect);
        }
      }
      this.action(getState+":index");
  })
  }
})
