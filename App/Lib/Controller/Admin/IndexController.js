/**
 * Created by wangwenbo on 15/6/6.
 */
/**
 * controller
 * @return
 */
module.exports = Controller("Admin/BaseController", function(){
    "use strict";
    var moment = require('moment');
    var Q = require('q');
    return {
        indexAction: Q.async(function* (){
          var orderModel = D('Orderproductcopy');
          var priceSUM = yield orderModel.where({productstate:['IN',['55','30']]}).sum('productprice');


          var orderComplete = yield orderModel.where({productstate:'55'}).count();
          var orderCancel = yield orderModel.where({productstate:'60'}).count();
          var waitPay = yield orderModel.where({productstate:'10'}).count();
          var hasPay = yield orderModel.where({productstate:'30'}).count();
          var ordercount = yield orderModel.count();

          var userCount = D('users').count();
          var adminCount = D('admin').count();
          var expresser = D('express').count();

          this.assign({
            sumPrice:priceSUM,
            orderComplete:orderComplete,
            orderCancel:orderCancel,
            waitPay:waitPay,
            hasPay:hasPay,
            userCount:userCount,
            adminCount:adminCount,
            expresser:expresser,
            ordercount:ordercount
          });
          return this.display();
        })
    };
});
