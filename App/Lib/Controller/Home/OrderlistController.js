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
                    if(data.count==0){
                        data.count=null;
                    }
                    for(var k in data.data){
                        data.data[k].ordertime = moment(data.data[k].ordertime).lang('zh-cn').format('YYYY-MM-DD HH:mm:ss');
                    }
                    self.assign({orderlist:data.data,count:data.count});
                    self.display();
                });
            });
            
        }
    };
});