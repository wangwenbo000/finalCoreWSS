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
                orderModel.getstaticcount('55').then(function(data){
                    self.assign({'succ':data.count});
                    return self.display();
                });

            });

        },
        fliterAction:function(){
            var self = this;
            var getJSON = self.post('fliterjson');
            D('Orderproductcopy').where(JSON.parse(getJSON)).order('id DESC').select().then(function(data){
                return self.end(data);
            });
        },
        getsingleorderinfoAction:function(){
            var self =this;
            var orderid = self.post('id');
            var orderModel = D('order').getorderinfobyid(orderid).then(function(data){
                return self.end(data);
            })
        }
    };
});