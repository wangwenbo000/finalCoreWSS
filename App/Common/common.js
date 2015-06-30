//这里定义一些全局通用的函数，该文件会被自动加载
global.staticFilter = function(data){
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
global.formatTime = function(data){
    var moment = require('moment');
    for(var k in data){
        data[k].ordertime = moment(data[k].ordertime).lang('zh-cn').format('LL');

    }
}
