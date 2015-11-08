module.exports = Model(function(){
    var Q = require('q');
    return {
        getuserorderlistinfo: Q.async(function* (id){
          //var orderData = yield D('Order').where({id:id}).order('id DESC').select();
          //formatTime(orderData,'llll','ordertime');
          //var orderlist = yield D('Orderproductcopy').where({orderid:id}).order('id DESC').countSelect();;
          //staticFilter(orderlist.data);
          //formatTime(orderlist.data,'YYYY-MM-DD dddd','time');
          //return {orderdata:orderData,listdata:orderlist.data,listcount:orderlist.count}

          //var userOrderList = yield D('Orderproductcopy').field("orderid,productname,singleprice,productstate").where({orderid: selectIdJson.orderid}).select();
          //var sqlStr = "SELECT *,";
          //sqlStr += "(SELECT COUNT(*) FROM `king_orderproductcopy` WHERE ( `orderid` = " + selectIdJson.orderid + " )) as listLength,";
          //sqlStr += "(SELECT COUNT(*) FROM `king_orderproductcopy` WHERE ( `orderid` = " + selectIdJson.orderid + " AND `productstate` = 55 )) as complete, ";
          //sqlStr += "(SELECT COUNT(*) FROM `king_orderproductcopy` WHERE ( `orderid` = " + selectIdJson.orderid + " AND `productstate` = 30 )) as waitExpress ";
          //sqlStr += "FROM `king_order` ";
          //sqlStr += "RIGHT JOIN king_Orderproductcopy ON king_order.id=king_Orderproductcopy.orderid ";
          //sqlStr += "LEFT JOIN king_payinfo ON king_order.id=king_payinfo.attach ";
          //sqlStr += "HAVING king_Orderproductcopy.id=" + selectIdJson.orderlistid;
          //var userOrderInfo = yield D('Order').query(sqlStr);
          //
          //userOrderInfo[0].orderlist = userOrderList;
          //return userOrderInfo;


        })
    }
})
