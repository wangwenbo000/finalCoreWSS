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
    indexAction: Q.async(function* () {
      var rp = require('request-promise');
      var baseUrl = "/Admin/order/index.html";
      var orderModel = D('Order');
      var moment = require('moment');
      var nextDay = moment().add(1, 'days').format('YYYY-MM-DD');
      // var getPage = this.get('page')||0;
      var data = yield orderModel.getorderlist(this.get('page'));
      // console.log('a',this.get('page'));

      var expressData = yield D('Express').order('ID DESC').field(['name', 'id']).select();
      var ExpressSelectData = [];
      for (var k in expressData) {
        var ExpressSelectJson = {};
        ExpressSelectJson['text'] = expressData[k].name;
        ExpressSelectJson['value'] = expressData[k].id;
        ExpressSelectData.push(ExpressSelectJson);
      }
      var expressAddress = yield orderModel.expressAddress();
      this.assign({
        'listJSON': data.data,
        'total': data.total,
        'count': data.count,
        'express': ExpressSelectData,
        'expressAddress': expressAddress,
        "nextday": nextDay
      });
      this.display();
    }),
    allocationAction: Q.async(function* () {
      var getUpdateId = JSON.parse(this.post('updateId'));
      var expresserid = parseInt(this.post('data'));
      var data = yield D('Orderproductcopy').where({id: ['IN', getUpdateId]}).update({expresserid: expresserid});
      return this.success({info: data});
    }),
    filterAction: function () {
      var self = this;
      var getJSON = self.post('fliterjson');
      var getPage = self.post('pagenum');
      var orderModel = D('order');
      orderModel.orderfilter(JSON.parse(getJSON), parseInt(getPage)).then(function (data) {
        return self.end(data);
      });
    },
    getsingleorderinfoAction: function () {
      var self = this;
      var orderid = self.post('id');
      var orderModel = D('order').getorderinfobyid(orderid).then(function (data) {
        return self.end(data);
      })
    },
    getattachmentinfoAction: function () {
      var self = this;
      var getPointId = self.post('pointid');
      var getSelectId = self.post('id');
      var orderModel = D('order').getattachmentinfo(getSelectId, getPointId).then(function (data) {
        return self.end(data);
      })
    },
    getpayinfoAction: Q.async(function*() {
      var getOrderId = parseInt(this.post('id'));
      var getPayInfoById = yield D('payinfo').where({'attach': getOrderId}).select();
      formatTime(getPayInfoById, 'llll', 'time_end');
      return this.end(getPayInfoById);
    }),
    changeOrderStatePayAction: Q.async(function* () {
      var getId = this.post('id');
      yield D('Orderproductcopy').where({orderid: getId}).update({
        productstate: '30'
      });
      yield D('Order').where({id: getId}).update({
        paystate: '1',
      });
      this.success();
    }),
    changeOrderStateCompleteAction: Q.async(function* () {
      var getId = this.post('id');
      yield D('Orderproductcopy').where({orderid: getId}).update({
        productstate: '55'
      });
      yield D('Order').where({id: getId}).update({
        paystate: '1',
      });
      yield D('Order').where({id: getId}).updateDec('nowstate');
      this.success();
    }),
    changeOrderStateCancelAction: Q.async(function* () {
      var getId = this.post('id');
      yield D('Orderproductcopy').where({orderid: getId}).update({
        productstate: '60'
      });
      yield D('Order').where({id: getId}).update({
        nowstate: '0'
      });
      this.success();
    }),

    /**
     * 获取订单列表 get_orderList()
     * HTTP/POST
     * oConfigJson = {
     *  where:    [Object],
     *  distinct: [String],
     *  field:    [String],
     *  order:    [String],
     *  starPage: [Number],
     *  pageNum   [Number]:
     * }
     */
    get_orderListAction: Q.async(function*() {
      if (this.isPost()) {
        var oConfigJson = this.post();
        var orderListResult = yield D('Order').get_orderList(oConfigJson);
        return this.success(orderListResult);
      } else {
        return this.error();
      }
    }),
    /**
     * 操作订单状态 update_orderState()
     * HTTP/POST
     * oConfigJson = {
     *  state:    [Object] | success | waitPay | waitExpress | cancel | refound,
     *  where:    [Object] {}
     * }
     */
    update_orderStateAction: Q.async(function*() {
      if (this.isPost()) {
        var oConfigJson = this.post();
        var orderStateResult = yield D('Order').get_orderState(oConfigJson);
        return this.success(orderStateResult);
      } else {
        return this.error();
      }
    }),
    /**
     * 获取订单详细信息 get_orderMainInfo()
     * HTTP/POST
     * oConfigJson = id [Number]
     */
    get_orderMainInfoAction: Q.async(function*() {
      if (this.isPost()) {
        var selectId = parseInt(this.post());
        var orderMainInfoResult = yield D('Order').get_orderMainInfo(selectId);
        return this.success(orderMainInfoResult);
      } else {
        return this.error();
      }
    }),
  };
});
