/**
 * controller
 * @return
 */
module.exports = Controller("Home/BaseController", function() {
  "use strict";
  var Q = require('q');
  return {
    indexAction: function() {
      this.display();
    },
    postwxmsgAction: Q.async(function*() {
      var rp = require('request-promise');
      var getOpenId = yield this.session('userInfo');
      console.log(getOpenId);
      var price = this.post('price');
      var access_token = yield S('access_token');
      var msgJSON = {
        "touser": getOpenId[0].openid,
        "template_id": "9Q6KfalrmRmoTb-w6gR34vdPIDKyFeB5JMDiCLjQ9Fo",
        "url": "http://www.izaoan.cn/home/orderlist",
        "topcolor": "#FF0000",
        "data": {
          "first": {
            "value": "您已经成功预订早餐，我们将尽快为您制作早餐",
            "color": "#173177"
          },
          "orderMoneySum": {
            "value": price+".00元",
            "color": "#F54343"
          },
          "orderProductName": {
            "value": "早安暖心早餐",
            "color": "#173177"
          },
          "Remark": {
            "value": "如有问题请致电010-56140532,或直接在微信留言，早安将第一时间为您服务！",
            "color": "#173177"
          }
        }
      };
      var postwxmsgJSON = {
        url: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token='+access_token,
        method: 'POST',
        json: true,
        body: msgJSON,
      };
      var requestMsg = yield rp(postwxmsgJSON);
      console.log(requestMsg);
      this.end(true);
    }),
  };
});
