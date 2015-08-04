/**
 * controller
 * @return
 */
module.exports = Controller("Home/BaseController", function(){
  "use strict";
  var Q = require('q');

  return {
    indexAction: Q.async(function* (){
      var moment = require('moment');
      var calendarArr = [];

      if(parseInt(moment().format('Hm'))>2200){
        var start = 2;
        var end = 9;
      }else{
        var start = 1;
        var end = 8;
      }

      for(var d=start;d<end;d++){
        calendarArr.push({
          days:moment().add(d,'days').format('DD'),
          week:moment().add(d,'days').locale('zh-cn').format('dd'),
          weeknum:moment().add(d,'days').locale('zh-cn').format('d'),
          date:moment().add(d,'days').locale('zh-cn').format('l'),
          chooseFoodList:'hidechoosefood',
          done:false
        });
      }

      yield this.session("userInfo",[{openid:"o510Kj_ydZPIMQdl1jww5w9MecQk",id:12}]);
      console.log(yield this.session("userInfo"));

      var userInfoData = yield this.session('userInfo');
      var addressListData = yield D('Addresslist').where({'userid':userInfoData[0].id}).order('id DESC').select();
      this.assign({'addresslist':addressListData,calendarArr:calendarArr,date:moment().format('YYYY/MM'),'WxUserInfo':userInfoData[0]});
      var productsData = yield D('Products').where({'isactive':'0'}).order('id DESC').field('id, days, price, productName, repertory').select();
      for(var k in calendarArr){
        var Arr = calendarArr[k]
        for(var kk in productsData){
          if(parseInt(productsData[kk].days)==Arr.weeknum){
            Arr['productInfo'] = productsData[kk];
            if(parseInt(productsData[kk].repertory)<=0){
              Arr['days'] = "罄";
            }
          }
        }
      };
      this.display();
    }),
    selectAction:function(){
      var self = this;
      var editId = self.post('id');
      self.session('userInfo').then(function(data){
        return D('Addresslist').where({'id':editId,'userid':data[0].id}).select().then(function(data){
          self.end(data);
        })
      });
    },
    updateAction:function(){
      var self=this;
      var getUpdateInfo = JSON.parse(self.post('info'));
      if(getUpdateInfo.id==undefined){
        var moment = require('moment');
        getUpdateInfo['time']=moment().format('YYYY-MM-DD HH:mm:ss');
        return D('Addresslist').add({
          receiveuser:getUpdateInfo['receiveuser'],
          phonenum:getUpdateInfo['phonenum'],
          addressKey:getUpdateInfo['addressKey'],
          address:getUpdateInfo['address'],
          userid:getUpdateInfo['userid'],
          time:getUpdateInfo['time']
        }).then(function(rowId){
          self.end('add');
        });
      }else{
        return D('Addresslist').where({id:getUpdateInfo.id}).update({
          receiveuser:getUpdateInfo['receiveuser'],
          phonenum:getUpdateInfo['phonenum'],
          addressKey:getUpdateInfo['addressKey'],
          address:getUpdateInfo['address']
        }).then(function(rowId){
          self.end('update');
        });
      }


    },
    payAction:function(){
      var moment = require('moment');
      var self = this;
      var getUserId = self.post('userid');
      var getPnum = parseInt(self.post('productnum'));
      var getAddressinfo = JSON.parse(self.post('addressinfo'));
      var getExpressTime = self.post('expresstime');
      var getReceiveWay = self.post('receiveWay');
      var chooseFoodList = JSON.parse(self.post('chooselist'));
      var ordernum = moment().format('YYYYMMDDHHmmss')+""+moment().millisecond();

      var total = 0;
      for(var k in chooseFoodList){
        total+=chooseFoodList[k]['singleprice'];
      }

        return D('Order').add({
          orderid:ordernum,
          ordertime:moment().format('YYYY-MM-DD HH:mm:ss'),
          address:getAddressinfo['address'],
          addressKey:getAddressinfo['addressKey'],
          pricetotal:total,
          orderfrom:1,
          userid:getUserId,
          nowstate:chooseFoodList.length
        }).then(function(rowId){
          for(var k in chooseFoodList){
            chooseFoodList[k]['expressaddress']=getAddressinfo['address'];
            chooseFoodList[k]['phonenum']=getAddressinfo['phonenum'];
            chooseFoodList[k]['receiveuser']=getAddressinfo['receiveuser'];
            chooseFoodList[k]['addressKey']=getAddressinfo['addressKey'];
            chooseFoodList[k]['orderid']=rowId;
            chooseFoodList[k]['productprice']=chooseFoodList[k]['singleprice']*getPnum;
            chooseFoodList[k]['productnum']=getPnum;
            chooseFoodList[k]['expressprice']=0;
            chooseFoodList[k]['productstate']=10;
            chooseFoodList[k]['expresstime']=getExpressTime;
            chooseFoodList[k]['userid']=getUserId;
            chooseFoodList[k]['ordernum']=ordernum;
            chooseFoodList[k]['foodimg']='';
            chooseFoodList[k]['receiveway'] = getReceiveWay;
          }
          return rowId;
        }).then(function(data){
          var orderRowId = data;
          return D('Orderproductcopy').addAll(chooseFoodList).then(function(){
            self.success({
              ordernum:ordernum,
              productprice:total*getPnum,
              orderid:orderRowId
            });
          })
        })
    },
    _404Action: function(){
      this.status(404); //发送404状态码
      this.end('404 not found');
    }
  };
});
