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
  // 微信token认证
global.isLegel = function(signature,timestamp,nonce,token){
  var self=this;
  var signature = self.get('signature');
  var timestamp = self.get('timestamp');
  var nonce = self.get('nonce');
  var echostr = self.get('echostr');
  var token = 'izaoan';

  var crypto=require('crypto');
  var array=new Array();
  array[0]=timestamp;
  array[1]=nonce;
  array[2]=token;
  array.sort();
  var hasher=crypto.createHash("sha1");
  var msg=array[0]+array[1]+array[2];
  hasher.update(msg);
  var msg=hasher.digest('hex');//计算SHA1值
  if(msg==signature){
      this.end(echostr);
  }else{
      this.end('false');
  }
}
global.WX_getToken = function(){
  var request = require('request');
  request({
    url:'https://api.weixin.qq.com/cgi-bin/token',
    qs:{grant_type:'client_credential',appid:'wxde2277be54c81c1d',secret:'5cdd015be8db790c01b98d7a980397b6'},
    method:'GET'
  },function(error,response,body){
    if(error){
      console.log(error);
    }else {
      S('access_token',body.access_token,{timeout:body.expires_in});
      console.log(body);
    }
  })
}

global.WX_getJsapi_ticket = function(token){
  var request = require('request');
  request({
    url:'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
    qs:{access_token:token},
    method:'GET'
  },function(error,response,body){
    if(error){
      console.log(error);
    }else {
      S('jsapi_ticket',body.ticket,{timeout:body.expires_in});
      console.log(body);
      return body.ticket;
    }
    });
}
