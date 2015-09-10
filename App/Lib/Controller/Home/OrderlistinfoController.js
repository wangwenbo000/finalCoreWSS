/**
 * controller
 * @return
 */
module.exports = Controller("Home/BaseController", function(){
    "use strict";
    var Q = require('q');
    return {
        indexAction: function(){
            var self = this;
            var getOrderInfoId = self.get('id');
            var getOrderListInfoModel = D('Orderlistinfo');

            return getOrderListInfoModel.getuserorderlistinfo(getOrderInfoId).then(function(data){
                self.assign({orderlistinfo:data,listcount:data.listcount});
                return self.display();
            });
        },
        cancelorderAction:Q.async(function* (){
            var id = this.post('id');
            yield D('Order').where({id:id}).update({nowstate:-1});
            yield D('Orderproductcopy').where({orderid:id}).update({productstate:60})
            this.end("ok");
        })
    };
});
