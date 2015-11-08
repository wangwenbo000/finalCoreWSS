/**
 * controller
 * @return
 */
module.exports = Controller("Home/BaseController", function () {
  "use strict";
  var Q = require('q');
  return {
    indexAction: Q.async(function*() {
      var getOrderInfoId = this.get('id');
      var getOrderInfo = yield D('Orderlistinfo').getuserorderlistinfo(getOrderInfoId);
      this.assign({orderlistinfo: getOrderInfo, listcount: getOrderInfo.listcount});
      return this.display();
    }),
    cancelorderAction: Q.async(function* () {
      var id = this.post('id');
      yield D('Order').where({id: id}).update({nowstate: -1});
      yield D('Orderproductcopy').where({orderid: id}).update({productstate: 60})
      this.end("ok");
    })
  };
});
