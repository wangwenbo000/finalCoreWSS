/**
 * controller
 * @return
 */
module.exports = Controller("Home/BaseController", function(){
    "use strict";
    return {
        indexAction: function(){
            var self=this;
            var isEdit = self.get('id')||null;
            if(isEdit){
                self.session('userInfo').then(function(data){
                    return D('Addresslist').where({'id':isEdit,'userid':data[0].id}).select().then(function(data){
                        self.assign('address',data);
                        self.display();
                    })
                });
            }else{
                return self.session('userInfo').then(function(data){
                    var defaultData = [];
                    console.log(data);
                    defaultData[0]={
                        userid:data[0].id
                    };
                    self.assign('address',defaultData);
                    self.display();
                });
            }
        },
        updateAction:function(){
            var self=this;
            var getUpdateJson = JSON.parse(self.post('updateJson'));
            var getId = parseInt(self.post('id'));
            if(!isNaN(getId)){
                D('Addresslist').where({id:getId}).update({
                    receiveuser:getUpdateJson['receiveuser'],
                    phonenum:getUpdateJson['phonenum'],
                    addressKey:getUpdateJson['addressKey'],
                    address:getUpdateJson['address']
                }).then(function(rows){
                    return self.end(rows);
                })
            }else{
                self.session('userInfo').then(function(data){
                    var moment = require('moment');
                    //getUpdateJson['userid']=data.id;
                    getUpdateJson['time']=moment().format('YYYY-MM-DD HH:mm:ss');
                    D('Addresslist').add(getUpdateJson).then(function(InsertId){
                        return self.end(InsertId);
                    });
                });
            }


        }
    };
});