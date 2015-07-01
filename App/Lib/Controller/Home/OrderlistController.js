/**
 * controller
 * @return
 */
module.exports = Controller("Home/BaseController", function(){
    "use strict";
    return {
        indexAction: function(){
            //render View/Home/index_index.html file
            var self = this;
            self.session('userInfo').then(function(data){
                var orderListModel = D('Orderlist');
                var moment = require('moment');
                orderListModel.getUserOrderList(data[0].id).then(function(data){
                    self.assign({orderlist:data});
                    self.display();
                });
            });
            
        }
    };
});