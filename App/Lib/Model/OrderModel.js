module.exports = Model(function(){
    return {
        //获取用户列表
        getorderlist: function(getPage){
            return D('Orderproductcopy').order('id DESC').page(getPage, 20).countSelect().then(function(data){
                for(var k in data.data){
                    switch (data.data[k].productstatic){
                        case '33':
                            data.data[k].productstatic = '已发货';
                            data.data[k].productstaticnum = '33';
                            break;
                        case '55':
                            data.data[k].productstatic = '已成功';
                            data.data[k].productstaticnum = '55';
                            break;
                        case '10':
                            data.data[k].productstatic = '待付款';
                            data.data[k].productstaticnum = '10';
                            break;
                        case '30':
                            data.data[k].productstatic = '待发货';
                            data.data[k].productstaticnum = '30';
                            break;
                        case '40':
                            data.data[k].productstatic = '待退款';
                            data.data[k].productstaticnum = '40';
                            break;
                        case '44':
                            data.data[k].productstatic = '已退款';
                            data.data[k].productstaticnum = '44';
                            break;
                        case '60':
                            data.data[k].productstatic = '已取消';
                            data.data[k].productstaticnum = '60';
                            break;
                        default :
                            data.data[k].productstatic = "异常!"
                            data.data[k].productstaticnum = 'err';
                    }
                }
                console.log(data);
                return data;
            });
        },
        getstaticcount:function(num){
            return D('Orderproductcopy').where({'productstatic':['=',num]}).countSelect().then(function(data){
                return data;
            });
        }
    }
})
