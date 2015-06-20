/**
 * Created by wangwenbo on 15/6/6.
 */
/**
 * controller
 * @return
 */
module.exports = Controller("Admin/BaseController", function(){
    "use strict";
    return {
        indexAction: function(){
            var Pager = require('thinkjs-navigator');
            var baseUrl = "/Admin/order/index.html";
            var self = this;
            var orderModel = D('Order');

            orderModel.getorderlist(self.get('page')).then(function(data){
                var pager = new Pager(data, baseUrl);
                var moment = require('moment');
                for(var k in data.data){
                    data.data[k].time = moment(data.data[k].time).lang('zh-cn').format('LLLL');
                }
                self.assign({pager:pager.render(
                    '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>',
                    '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>',
                    "3",
                    "...",
                    {
                    itemTag: 'li', // 每个按钮的标签
                    textTag: 'span', // 分割符文本的标签
                    currentClass: 'active', // 当前选中的页码 Class
                    prevClass: 'prev', // 上一页 Class
                    nextClass: 'next' // 下一页 Class
                }),'orderList':data.data,'count':data.count});


            }).then(function(){
                var stateJsonCase = {
                    "HAS_SUCC":'55',
                    "HAS_POST":'33',
                    "WAIT_PAY":'10',
                    "WAIT_POST":'30',
                    "WAIT_REFUND":'40',
                    "HAS_REFUND":'44',
                    "HAS_CANCEL":'60',
                    "ERROR":'err'
                };
                orderModel.getstatecount('55').then(function(data){
                    self.assign({"HAS_SUCC":data.count});
                });
            }).then(function(){
                orderModel.getstatecount('33').then(function(data){
                    self.assign({"HAS_POST":data.count});
                });
            }).then(function(){
                orderModel.getstatecount('10').then(function(data){
                    self.assign({"WAIT_PAY":data.count});
                });
            }).then(function(){
                orderModel.getstatecount('30').then(function(data){
                    self.assign({"WAIT_POST":data.count});
                });
            }).then(function(){
                orderModel.getstatecount('40').then(function(data){
                    self.assign({"WAIT_REFUND":data.count});
                });
            }).then(function(){
                orderModel.getstatecount('44').then(function(data){
                    self.assign({"HAS_REFUND":data.count});
                });
            }).then(function(){
                orderModel.getstatecount('60').then(function(data){
                    self.assign({"HAS_CANCEL":data.count});
                });
            }).then(function(){
                orderModel.getstatecount('err').then(function(data){
                    self.assign({"ERROR":data.count});
                    return self.display();
                });
            })

        },
        filterAction:function(){
            var self = this;
            var getJSON = self.post('fliterjson');
            var orderModel = D('order');
            orderModel.orderfilter(JSON.parse(getJSON)).then(function(data){
                return self.end(data);
            });
        },
        getsingleorderinfoAction:function(){
            var self =this;
            var orderid = self.post('id');
            var orderModel = D('order').getorderinfobyid(orderid).then(function(data){
                return self.end(data);
            })
        },
        getattachmentinfoAction:function(){
            var self = this;
            var getPointId = self.post('pointid');
            var getSelectId = self.post('id');
            var orderModel = D('order').getattachmentinfo(getSelectId,getPointId).then(function(data){
                return self.end(data);
            })
        }
    };
});