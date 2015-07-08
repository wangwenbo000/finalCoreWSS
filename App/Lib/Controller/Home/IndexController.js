/**
 * controller
 * @return
 */
module.exports = Controller("Home/BaseController", function(){
  "use strict";
  return {
    indexAction: function(){
      //render View/Home/index_index.html file
      var self = this;
      var moment = require('moment');
      var calendarArr = [];

      console.log(moment().format('Hm'));

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
            console.log(calendarArr);
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
        }).then(function(){
          self.end('aok');
        });
      }else{
        return D('Addresslist').where({id:getUpdateInfo.id}).update({
          receiveuser:getUpdateInfo['receiveuser'],
          phonenum:getUpdateInfo['phonenum'],
          addressKey:getUpdateInfo['addressKey'],
          address:getUpdateInfo['address']
        }).then(function(){
          self.end('ok');
        });
      }


    },
    _404Action: function(){
      this.status(404); //发送404状态码
      this.end('404 not found');
    }
  };
});
