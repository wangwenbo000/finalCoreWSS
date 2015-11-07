/**
 * controller
 * @return
 */
module.exports = Controller("Home/BaseController", function () {
  "use strict";
  var Q = require('q');
  var moment = require('moment');

  return {
    indexAction: Q.async(function* () {

      var calendarArr = [];
      var yearAndMonth = moment().format('YYYY/MM');
      var startDateSign = 1;
      var endDateSign = 8;

      if (parseInt(moment().format('Hm')) > 2200) {
        startDateSign = 2;
        endDateSign = 9;
      }

      for (var d = startDateSign; d < endDateSign; d++) {
        calendarArr.push({
          days: moment().add(d, 'days').locale('zh-cn').format('DD'),
          week: moment().add(d, 'days').locale('zh-cn').format('dd'),
          weeknum: moment().add(d, 'days').locale('zh-cn').format('d'),
          date: moment().add(d, 'days').locale('zh-cn').format('l'),
          chooseFoodList: 'hidechoosefood',
          done: false
        });
      }

      //模拟假数据
      yield this.session("userInfo", {"openid": "o510Kj_ydZPIMQdl1jww5w9MecQk"});

      var oUserInfo = yield this.session("userInfo");
      var oAddressList = yield D('Addresslist').where({'openid': oUserInfo.openid}).order('id DESC').select();
      var oProductsList = yield D('Products').where({'isactive': '0'}).order('id DESC').select();

      //建立关联
      for (var k in calendarArr) {
        var Arr = calendarArr[k];
        for (var kk in oProductsList) {
          if (parseInt(oProductsList[kk].days) == Arr.weeknum) {
            Arr['productInfo'] = oProductsList[kk];
            if (parseInt(oProductsList[kk].repertory) <= 0) {
              Arr['days'] = "罄";
            }
          }
        }
      }

      //输出数据
      this.assign({
        'addresslist': oAddressList,
        'calendarArr': calendarArr,
        'date': yearAndMonth,
        'WxUserInfo': oUserInfo
      });

      this.display();
    }),
    payAction: Q.async(function* () {
      var moment         = require('moment');
      var getUserId      = this.post('userid');
      var getPnum        = parseInt(this.post('productnum'));
      var getAddressinfo = JSON.parse(this.post('addressinfo'));
      var getExpressTime = this.post('expresstime');
      var getReceiveWay  = this.post('receiveWay');
      var chooseFoodList = JSON.parse(this.post('chooselist'));
      var ordernum       = moment().format('YYYYMMDDHHmmss') + "" + moment().millisecond();

      var total = 0;
      var cost  = 0;

      for (var k in chooseFoodList) {
        total += chooseFoodList[k]['singleprice'];
        cost += chooseFoodList[k]['costprice'];
      }

      var rowId = yield D('Order').add({
        orderid: ordernum,
        ordertime: moment().format('YYYY-MM-DD HH:mm:ss'),
        receiveuser: getAddressinfo['receiveuser'],
        address: getAddressinfo['address'],
        addressKey: getAddressinfo['addressKey'],
        pricetotal: total * getPnum,
        costtotal: cost * getPnum,
        orderfrom: 1,
        userid: getUserId,
        nowstate: chooseFoodList.length
      });

      for (var k in chooseFoodList) {
        chooseFoodList[k]['expressaddress'] = getAddressinfo['address'];
        chooseFoodList[k]['phonenum'] = getAddressinfo['phonenum'];
        chooseFoodList[k]['receiveuser'] = getAddressinfo['receiveuser'];
        chooseFoodList[k]['addressKey'] = getAddressinfo['addressKey'];
        chooseFoodList[k]['orderid'] = rowId;
        chooseFoodList[k]['productprice'] = chooseFoodList[k]['singleprice'] * getPnum;
        chooseFoodList[k]['costprice'] = chooseFoodList[k]['costprice'] * getPnum;
        chooseFoodList[k]['productnum'] = getPnum;
        chooseFoodList[k]['expressprice'] = 0;
        chooseFoodList[k]['productstate'] = 10;
        chooseFoodList[k]['expresstime'] = getExpressTime;
        chooseFoodList[k]['userid'] = getUserId;
        chooseFoodList[k]['ordernum'] = ordernum;
        chooseFoodList[k]['foodimg'] = chooseFoodList[k]['foodimg'];
        chooseFoodList[k]['receiveway'] = getReceiveWay;
        delete chooseFoodList[k]['days'];
      }

      yield D('Orderproductcopy').addAll(chooseFoodList);
      yield D('Addresslist').where({id: getAddressinfo['id']}).updateInc('usecount');

      return this.success({
        ordernum: ordernum,
        productprice: total * getPnum,
        orderid: rowId
      });
    })
  };
});
