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

        },
        getinfobyidAction:function(){
            var self = this;
            var selectId = self.post('id');
            var productModel = D('product');
            return productModel.selectById(selectId).then(function(data){
                return self.end(data);
            })
        }
    };
});