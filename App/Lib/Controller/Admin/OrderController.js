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
            var baseUrl = "/Admin/order/index.html";
            var self = this;
            var orderModel = D('Order');

            orderModel.getorderlist(self.get('page')).then(function(data){
                formatTime(data.data,'LLLL','time');
                self.assign({listJSON:data.data,total:data.total,'count':data.count});
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
            var getPage = self.post('pagenum');
            var orderModel = D('order');
            orderModel.orderfilter( JSON.parse(getJSON),parseInt(getPage)).then(function(data){
                self.assign({'pagenum':data.page});
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