/**
 * controller
 * @return
 */
module.exports = Controller("Home/BaseController", function () {
  "use strict";
  var Q = require('q');
  var addresslistModel = D('Addresslist');
  return {
    indexAction: Q.async(function* () {
      var isEdit = this.get('openid');
      if (isEmpty(isEdit)) {
        // 添加新地址
        var userInfoData = yield this.session('userInfo');
        var initData = [];
        initData.push({openid: userInfoData.openid, receiveuser: '', phonenum: '', address: '', addressKey: ''});
        this.assign('initData', initData);
        this.display();
      } else {
        // 更新地址
        //var fieldArr = ['id', 'userid', 'address', 'addressKey', 'phonenum', 'receiveuser',];
        var initData = addresslistModel.where({openid: isEdit}).select();
        this.assign('initData', initData);
        this.display();
      }
    }),
    updateAction: Q.async(function* () {
      var getUpdateJson = JSON.parse(this.post('updateJson'));
      var getAddressId = this.post('openid');
      if (!isNaN(getAddressId)) {
        // 更新数据
        var updataRow = yield addresslistModel.where({openid: getAddressId}).update({
          receiveuser: getUpdateJson['receiveuser'],
          phonenum: getUpdateJson['phonenum'],
          addressKey: getUpdateJson['addressKey'],
          address: getUpdateJson['address']
        });
        return this.success({updateRow: updataRow});
      } else {
        // 添加新数据
        var userInfoData = yield this.session('userInfo');
        var moment = require('moment');
        getUpdateJson['time'] = moment().format('YYYY-MM-DD HH:mm:ss');
        var addId = yield addresslistModel.add(getUpdateJson);
        return this.success({
          addId: addId,
          receiveuser: getUpdateJson['receiveuser'],
          phonenum: getUpdateJson['phonenum'],
          addressKey: getUpdateJson['addressKey'],
          address: getUpdateJson['address']
        });
      }
    })
  };
});
