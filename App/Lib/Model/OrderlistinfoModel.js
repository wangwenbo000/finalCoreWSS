module.exports = Model(function(){
    return {
        //获取用户列表
        getUserOrderListInfo: function(id){
            return D('Order').where({id:id}).order('id DESC').select().then(function(data){
                formatTime(data,'llll','ordertime');
                return data;
            }).then(function(data){
                var orderData = data;
                return D('Orderproductcopy').where({orderid:data[0].id}).order('id DESC').countSelect().then(function(data){
                    staticFilter(data.data);
                    formatTime(data,'llll','ordertime');
;                    return {orderdata:orderData,listdata:data.data,listcount:data.count}
                })
            })
        }
    }
})