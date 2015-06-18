module.exports = Model(function(){
    function staticFilter(data){
        for(var k in data){
            switch (data[k].productstatic){
                case '33':
                    data[k].productstatic = '已发货';
                    data[k].productstaticnum = '33';
                    break;
                case '55':
                    data[k].productstatic = '已成功';
                    data[k].productstaticnum = '55';
                    break;
                case '10':
                    data[k].productstatic = '待付款';
                    data[k].productstaticnum = '10';
                    break;
                case '30':
                    data[k].productstatic = '待发货';
                    data[k].productstaticnum = '30';
                    break;
                case '40':
                    data[k].productstatic = '待退款';
                    data[k].productstaticnum = '40';
                    break;
                case '44':
                    data[k].productstatic = '已退款';
                    data[k].productstaticnum = '44';
                    break;
                case '60':
                    data[k].productstatic = '已取消';
                    data[k].productstaticnum = '60';
                    break;
                default :
                    data[k].productstatic = "异常!"
                    data[k].productstaticnum = 'err';
            }
        }
    };
    function isCallMeUpFilter(data){
        for(var k in data){
            switch (data[k].iscallmeup){
                case '1':
                    data[k].iscallmeup = '是';
                    break;
                case '0':
                    data[k].iscallmeup = '否';
                    break;
                default :
                    data[k].iscallmeup = "异常!"
            }
        }
    }
    return {
        //获取用户列表
        getorderlist: function(getPage){
            return D('Orderproductcopy').order('id DESC').page(getPage, 20).countSelect().then(function(data){
                staticFilter(data.data);
                return data;
            });
        },
        getstaticcount:function(num){
            return D('Orderproductcopy').where({'productstatic':['=',num]}).countSelect().then(function(data){
                return data;
            });
        },
        getorderinfobyid:function(id){
            return D('Orderproductcopy').where({'id':id}).select().then(function(data){
                staticFilter(data);
                isCallMeUpFilter(data);
                return data;
            })
        }
    }
})
