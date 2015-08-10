/**
 * controller
 * @return
 */
module.exports = Controller("Home/BaseController", function(){
    "use strict";
    var Q = require('q');
    return {
        indexAction: Q.async(function* (){
            var userInfoData = yield this.session('userInfo');
            var orderListModel = D('Orderlist');
            var orderListInfo = yield orderListModel.getUserOrderList(userInfoData[0].id);
            this.assign({orderlist:orderListInfo});
            this.display();
        })
    };
});
