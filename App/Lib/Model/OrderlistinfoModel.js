module.exports = Model(function(){
    var Q = require('q');
    return {
        getuserorderlistinfo: Q.async(function* (id){
          var orderData = yield D('Order').where({id:id}).order('id DESC').select();
          formatTime(orderData,'llll','ordertime');
          var orderlist = yield D('Orderproductcopy').where({orderid:id}).order('id DESC').countSelect();;
          staticFilter(orderlist.data);
          formatTime(orderlist.data,'YYYY-MM-DD dddd','time');
          return {orderdata:orderData,listdata:orderlist.data,listcount:orderlist.count}
        })
    }
})
