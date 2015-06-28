module.exports = Model(function(){
    var returnJson = [];
    function selectorderinfo(id,state){
        return D('Orderproductcopy').where({orderid:id,productstate:state}).order('id DESC').countSelect().then(function(data){
            console.log(data.data);
            returnJson.push(data.data);
            console.log(returnJson);
            return data;
        })
    }
    return {
        //获取用户列表
        getUserOrderList: function(id){
            //return D('Order').where({userid:id}).order('id DESC').countSelect().then(function(data){
            //    return data;
            //}).then(function(data){
            //    var dataLength = data.data.length;
            //    for(var k in data.data){
            //        selectorderinfo(data.data[k].id,30);
            //    }
            //})

            //return D('Order').join('king_orderproductcopy ON king_order.id=king_orderproductcopy.orderid').select().then(function(data){
            //    console.log(data);
            //});

            D('Orderproductcopy').join({
                table: 'order',
                join: 'inner', //join方式，有 left, right, inner 3种方式
                as: 'c', //表别名
                on: ['orderid', 'id'] //ON条件
            }).where('c.userid=12').select().then(function(data){
                console.log(data);
            });

            //return D('Order').alias('o').field('o.id as order_id').where('order_id=12').select().then(function(data){
            //    console.log(data);
            //});

            //return D('Order').where({userid:12}).select().then(function(data){
            //    console.log(data);
            //});

            //return D('Orderproductcopy').where({orderid:id,productstate:30}).buildSql().then(function(sql){
            //    console.log(sql);
            //})
        }
    }
})