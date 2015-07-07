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

      if(parseInt(moment().format('Hm'))>220){
        var start = 2;
        var end = 9;
      }else{
        var start = 1;
        var end = 8;
      }

      for(var d=start;d<end;d++){
        calendarArr.push({
          days:moment().add('days',d).format('DD'),
          week:moment().add('days',d).lang('zh-cn').format('dd'),
          date:moment().add('days',d).lang('zh-cn').format('l'),
          choose:'',
          done:true
        });
      }
      self.session('userInfo').then(function(data){
        return D('Addresslist').where({'userid':data[0].id}).order('id DESC').select().then(function(data){
          self.assign({'addresslist':data,userid:data[0].userid,calendarArr:calendarArr,date:moment().format('YYYY/MM')});
          self.display();
        });
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