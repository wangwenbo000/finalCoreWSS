module.exports = Model(function(){
    function staticFilter(data){
        for(var k in data){
            switch (data[k].productstate){
                case '33':
                    data[k].productstate = '已发货';
                    data[k].productstatenum = '33';
                    break;
                case '55':
                    data[k].productstate = '已成功';
                    data[k].productstatenum = '55';
                    break;
                case '10':
                    data[k].productstate = '待付款';
                    data[k].productstatenum = '10';
                    break;
                case '30':
                    data[k].productstate = '待发货';
                    data[k].productstatenum = '30';
                    break;
                case '40':
                    data[k].productstate = '待退款';
                    data[k].productstatenum = '40';
                    break;
                case '44':
                    data[k].productstate = '已退款';
                    data[k].productstatenum = '44';
                    break;
                case '60':
                    data[k].productstate = '已取消';
                    data[k].productstatenum = '60';
                    break;
                default :
                    data[k].productstate = "异常!"
                    data[k].productstatenum = 'err';
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
                    return D('Orderproductcopy').where({'productstate':['=',data]}).countSelect().then(function(data){
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
                    switch (data[k].orderfrom){
                        case 2:
                            data[k].orderfrom = "PC用户";
                            data[k].orderstate = "warning";
                            break;
                        case 1:
                            data[k].orderfrom = "微信用户";
                            data[k].orderstate = "success";
                            break;
                        default :
                            data[k].orderfrom = "未知终端";
                            data[k].orderstate = "danger";
                    }
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
        orderfilter:function(json,getPage){
            return D('Orderproductcopy').where(json).order('id DESC').page(getPage, 20).countSelect().then(function(data){
                staticFilter(data.data);
                isCallMeUpFilter(data.data);
                return data;
            });
        }
    }
})
