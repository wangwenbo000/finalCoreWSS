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
global.formatTime = function(data,format,proto){
    var moment = require('moment');
    for(var k in data){
        data[k][proto] = moment(data[k][proto]).locale('zh-cn').format(format);

    }
}
global.createId = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		}).toUpperCase();
	}
