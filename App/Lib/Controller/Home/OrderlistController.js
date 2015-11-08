/**
 * controller
 * @return
 */
module.exports = Controller("Home/BaseController", function () {
  "use strict";
  var Q = require('q');
  return {
    indexAction: Q.async(function* () {
      var userInfoData = yield this.session('userInfo');
      var orderListInfo = yield D('Orderlist').get_userOrderList(userInfoData.openid);
      console.log(orderListInfo);
      this.assign({orderlist: orderListInfo});
      this.display();
    })
  };
});
