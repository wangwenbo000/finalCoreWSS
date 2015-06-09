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
            var self = this;
            var getProductList = D('Product');
            return getProductList.getProduct().then(function(data){
                self.assign('productList',data);
                return self.display();
            });

        }
    };
});