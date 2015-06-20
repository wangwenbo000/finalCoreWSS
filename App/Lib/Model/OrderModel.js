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
        getstatecount:function(data){
                    return D('Orderproductcopy').where({'productstatic':['=',data]}).countSelect().then(function(data){
                        return data;
                    });
        },
        getorderinfobyid:function(id){
            return D('Orderproductcopy').where({'id':id}).select().then(function(data){
                staticFilter(data);
                isCallMeUpFilter(data);
                return data;
            })
        },
        getattachmentinfo:function(orderid,pointid){
            var attachmentJSON = {};
            var moment = require('moment');
            return D('Order').where({'id':orderid}).select().then(function(data){
                for(var k in data){
                    data[k].ordertime = moment(data[k].ordertime).lang('zh-cn').format('LLLL');
                }
                attachmentJSON.attachment=data[0];
                return {'json':data,'now':pointid};
            }).then(function(data){
                var pointId = parseInt(data.now);
                var userId = data.json[0].userid;
                console.log(userId);
                return D('Orderproductcopy').where({'orderid':data.json[0].id}).select().then(function(data){
                    staticFilter(data);
                    isCallMeUpFilter(data);
                    for(var k in data){
                        data[k].time = moment(data[k].time).lang('zh-cn').format('LLLL');
                        switch (data[k].id){
                            case pointId:
                                data[k].thisPoint = "warning";
                                break;
                            default :
                                data[k].thisPoint = 'a';
                        }
                    }
                    attachmentJSON.attach=data;
                    return userId;
                });
            }).then(function(userid){
                return D('Users').where({'id':userid}).select().then(function(data){
                    attachmentJSON.userInfo=data[0];
                    return attachmentJSON;
                });
            })
        },
        orderfilter:function(json){
            return D('Orderproductcopy').where(json).order('id DESC').select().then(function(data){

                staticFilter(data);
                isCallMeUpFilter(data);
                console.log(data);
                return data;
            });
        }
    }
})
