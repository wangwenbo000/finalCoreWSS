/**
 * Created by wangwenbo on 15/6/6.
 */
/**
 * controller
 * @return
 */
module.exports = Controller("Admin/BaseController", function () {
  "use strict";
  var Q = require('q');
  return {
    indexAction: function () {
      var Pager = require('thinkjs-navigator');
      var baseUrl = "/Admin/User/index.html";
      var self = this;

      var getUserList = D('User');
      var getPage = self.get("page");
      getUserList.getList(getPage).then(function (data) {
        var pager = new Pager(data, baseUrl);
        self.assign({'userList': data.data, total: data.total, 'userCount': data.count});
        return self.display();
      })
    },
    getuseraddresslistAction: function () {
      var self = this;
      var getuserid = self.post('id');
      var userModel = D('user');
      return userModel.getUserAddressList(getuserid).then(function (data) {
        return self.end(data);
      })
    },
    getfliterusersdatalistAction: function () {
      var self = this;
      var filterJSON = self.post('fliterjson');
      console.log(filterJSON);
      var pageNum = self.post('pagenum');
      var realFilterJson = JSON.parse(filterJSON);
      var userModel = D('user');
      userModel.getFilterList(realFilterJson, pageNum).then(function (data) {
        return self.end(data);
      });
    },
    updateUserAddressOpenIdAction: Q.async(function* () {
      var userid = yield D('Users').field('id').select();
      var addressofuserid = yield D('Addresslist').field('userid').select();
      var useridArr = arrToObj(addressofuserid, "userid", null);
      var usersopenid = yield D('users').where({id: ['IN', useridArr]}).field('id,openid').select();

      var updateId = arrToObj(usersopenid, "id", null);
      var updateopenid = arrToObj(usersopenid, 'openid', null);

      //var update = yield D('addresslist').where({userid:['IN',updateId]}).update()

      for (var i in usersopenid) {
        var update = yield D('addresslist').where({userid: usersopenid[i]["id"]}).update({openid: usersopenid[i]["openid"]});
      }
      return this.success("ok");
    }),
    updateUserOrderOpenIdAction: Q.async(function*() {
      var useridData = yield D('Users').field('id,openid').select();
      var useridDataFromOrder = yield D('Order').field('id,openid').select();
      //for (var i in useridData) {
      //  var update = yield D('Order').where({userid: useridData[i]["id"]}).update({openid: useridData[i]["openid"]});
      //}
      for (var i in useridDataFromOrder) {
        var update = yield D('Orderproductcopy').where({orderid: parseInt(useridDataFromOrder[i]["id"])}).update({openid: useridDataFromOrder[i]["openid"]});
      }
      return this.success(useridData);
    })
  };
});
