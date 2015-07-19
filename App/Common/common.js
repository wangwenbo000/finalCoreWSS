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

global.getSexFromId = function(idNo){
  var UUserCard = idNo;
  if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
  return '1';
  } else {
  return '0';
  }
}

global.getAgeFromId = function(idNo){
  var UUserCard = idNo;
  var myDate = new Date();
  var month = myDate.getMonth() + 1;
  var day = myDate.getDate();
  var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
  if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
  age++;
  }
  return age;
}

global.getBorthFromId = function(idNo){
  var UUserCard = idNo;
  return UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
}

global.WX_createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15);
}

global.WX_createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
}

global.WX_raw = function (args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};

global.WX_sign = function (jsapi_ticket, url) {
  var timestamp = WX_createTimestamp();
  var nonceStr = WX_createNonceStr();
  var ret = {
    jsapi_ticket: jsapi_ticket,
    nonceStr: nonceStr,
    timestamp: timestamp,
    url: url
  };
  var string = WX_raw(ret);
  var crypto=require('crypto');
  var hasher=crypto.createHash("sha1");
  hasher.update(string);
  var ret=hasher.digest('hex');
  // return ret;
  var returnJSON = {
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: 'wxde2277be54c81c1d', // 必填，公众号的唯一标识
    timestamp: timestamp, // 必填，生成签名的时间戳
    nonceStr: nonceStr, // 必填，生成签名的随机串
    signature: ret,// 必填，签名，见附录1
    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','hideMenuItems','showMenuItems','chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  };
  return returnJSON;
};
