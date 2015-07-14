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
      var moment = require('moment');
      var OAuth = require('wechat-oauth');
      var appid = 'wxde2277be54c81c1d';
      var secret = '5cdd015be8db790c01b98d7a980397b6';
      var client = new OAuth(appid,secret);
      var getCode = self.get('code');
      var getState = self.get('state');

      var url = '/Home?showwxpaytitle=1';

      client.getAccessToken(getCode, function (err, result) {
        var accessToken = result.data.access_token;
        var openid = result.data.openid;

        client.getUser(openid, function (err, result) {
          return D('Users').where({'openid':result.openid}).countSelect().then(function(data){
            if(data.count==1){
              data.data[0].face = result.headimgurl;
              self.session('userInfo',data.data);
            }else{
              // 做一个存储数据库的操作
              // 并将信息存储到session
              return D('Users').add({
                openid:result.openid,
                username:result.nickname,
                sex:result.sex,
                language:result.language,
                location:result.city+','+result.province+','+result.country,
                face:result.headimgurl,
                subscribeTime:moment().format('X')
              }).then(function(rowId){
                return D('Users').where({'id':rowId}).countSelect().then(function(data){
                  if(data.count==1){
                    data.data.face = result.headimgurl;
                    self.session('userInfo',data.data);
                  }else {
                    self.action('Error:index');
                  }
                });
              });

            }
          }).then(function(){
            self.action(getState+":index");
          })
        });
    });
    }
  }
})
