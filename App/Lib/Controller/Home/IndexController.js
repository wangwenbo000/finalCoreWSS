/**
 * controller
 * @return
 */
module.exports = Controller("Home/BaseController", function(){
  "use strict";
  return {
    indexAction: function(){
      //render View/Home/index_index.html file
      var moment = require('moment');
      var self = this;
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
          days:moment().add('days',d).format('DD'),
          week:moment().add('days',d).locale('zh-cn').format('dd'),
          weeknum:moment().add('days',d).locale('zh-cn').format('d'),
          date:moment().add('days',d).locale('zh-cn').format('l'),
          choose:'',
          chooseFoodList:'hidechoosefood',
          done:true
        });
      }
      self.session('userInfo').then(function(data){
        return D('Addresslist').where({'userid':data[0].id}).order('id DESC').select().then(function(data){
          self.assign({'addresslist':data,userid:data[0].userid,calendarArr:calendarArr,date:moment().format('YYYY/MM')});
        }).then(function(){
          var productsModel = D('Product');
          return D('Products').where({'isactive':'0'}).order('id DESC').field('id, days, price, productName, repertory').select().then(function(data){
            return data;
          }).then(function(data){
            for(var k in calendarArr){
              var Arr = calendarArr[k]
              for(var kk in data){
                if(parseInt(data[kk].days)==Arr.weeknum){
                  Arr['productInfo'] = data[kk];
                }
              }
            }
            self.display();
          });
        })
      });
    },
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
          self.end(rowId);
        });
      }else{
        return D('Addresslist').where({id:getUpdateInfo.id}).update({
          receiveuser:getUpdateInfo['receiveuser'],
          phonenum:getUpdateInfo['phonenum'],
          addressKey:getUpdateInfo['addressKey'],
          address:getUpdateInfo['address']
        }).then(function(rowId){
          self.end('ok');
        });
      }


    },
    payAction:function(){
      var moment = require('moment');
      var self = this;
      var getUserId = self.post('userid');
      var getPnum = self.post('productnum');
      var getAddressinfo = JSON.parse(self.post('addressinfo'));
      var getExpressTime = self.post('expresstime');
      var getReceiveWay = self.post('receiveWay');
      var chooseFoodList = JSON.parse(self.post('chooselist'));
      var orderid = moment().format('YYYYMMDDHHmmss')+""+moment().millisecond();

      var total = 0;
      for(var k in chooseFoodList){
        total+=chooseFoodList[k]['singleprice'];
      }

        return D('Order').add({
          orderid:orderid,
          ordertime:moment().format('YYYY-MM-DD HH:mm:ss'),
          address:getAddressinfo['address'],
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
            chooseFoodList[k]['ordernum']=orderid;
            chooseFoodList[k]['foodimg']='';
          }
          console.log(chooseFoodList);
        }).then(function(){
          return D('Orderproductcopy').addAll(chooseFoodList).then(function(){
            self.end('ok');
          })
        })
    },
    _404Action: function(){
      this.status(404); //发送404状态码
      this.end('404 not found');
    }
  };
});
