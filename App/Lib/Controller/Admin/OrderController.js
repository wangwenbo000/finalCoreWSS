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
            D('Orderproductcopy').order('id DESC').page(self.get("page"), 20).countSelect().then(function(data){
                var pager = new Pager(data, baseUrl);
                self.assign({pager:pager.render(),'orderList':data.data,'count':data.count});

            }).then(function(){
                D('Orderproductcopy').where({'productstatic':['=',55]}).countSelect().then(function(data){
                    console.log(data.count);
                    return self.display();
                });
            });

        }
    };
});