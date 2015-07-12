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

      var OAuth = require('wechat-oauth');
      var appid = 'wxde2277be54c81c1d';
      var secret = '5cdd015be8db790c01b98d7a980397b6';
      var client = new OAuth(appid,secret);
      var getCode = self.get('code');
      console.log(getCode);
      var redirect_uri = 'http://www.izaoan.cn';
      var scope = 'snsapi_userinfo';
      var state = 'getCODEok';
      var url = client.getAuthorizeURL(redirect_uri, state, scope);
      var getState = self.get('state');
      if(getState==''){
        self.redirect(url);
      }

      client.getAccessToken(getCode, function (err, result) {
        var accessToken = result.data.access_token;
        var openid = result.data.openid;

        return D('Users').where({'openid':openid}).countSelect().then(function(data){
          if(data.count==1){
            console.log(data);
            self.session('userInfo',data.data);
            return self.assign('userInfo',data.data[0]);
          }
          // else{
            //做一个存储数据库的操作
            //并将信息存储到session
            // client.getUser(openid, function (err, result){
            //   var userInfo = result;
            //   return D('Users').add({
            //
            //   }).then(function(){
            //
            //   });
            // });
          // }
      });
    });

      // return D('Users').where({'openid':'o510Kj_ydZPIMQdl1jww5w9MecQk'}).countSelect().then(function(data){
      //   if(data.count==1){
      //     console.log(data);
      //     self.session('userInfo',data.data);
      //     return self.assign('userInfo',data.data[0]);
      //   }else{
      //     //做一个存储数据库的操作
      //     //并将信息存储到session
      //     client.getUser(openid, function (err, result) {
      //       var userInfo = result;
      //       return D('Users').add({
      //
      //       }).then(function(){
      //
      //       })
      //     });
      //   }
      // });


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
                  if(parseInt(data[kk].repertory)<=0){
                    Arr['days'] = "罄";
                  }
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
            chooseFoodList[k]['ordernum']=orderid;
            chooseFoodList[k]['foodimg']='';
          }
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
