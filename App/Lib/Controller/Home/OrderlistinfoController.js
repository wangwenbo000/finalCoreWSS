/**
 * controller
 * @return
 */
module.exports = Controller("Home/BaseController", function(){
    "use strict";
    return {
        indexAction: function(){
            var self = this;
            var getOrderInfoId = self.get('id');
            console.log(getOrderInfoId);
            var getOrderListInfoModel = D('Orderlistinfo');
            console.log('a');

            return getOrderListInfoModel.getuserorderlistinfo(getOrderInfoId).then(function(data){
                self.assign({orderlistinfo:data,listcount:data.listcount});
                return self.display();
            });
            // self.display();

        }
    };
});
