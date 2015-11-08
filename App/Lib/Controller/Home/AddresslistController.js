/**
 * controller
 * @return
 */
module.exports = Controller("Home/BaseController", function () {
  "use strict";
  var Q = require('q');
  return {
    indexAction: Q.async(function* () {
      var userInfo = yield this.session('userInfo');
      var addressList = yield D('Addresslist').where({'openid': userInfo.openid}).order('id DESC').select();
      this.assign('addresslist', addressList);
      this.display();
    }),
    delAction: function () {
      var self = this;
      var getid = self.post('id');
      return D('Addresslist').where({id: getid}).delete().then(function (row) {
        self.end(row);
      });
    }
  };
});
