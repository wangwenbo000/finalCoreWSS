/**
 * Created by wangwenbo on 15/6/6.
 */
/**
 * controller
 * @return
 */
module.exports = Controller("Admin/BaseController", function(){
    "use strict";
    return {
        indexAction: function(){
            var Pager = require('thinkjs-navigator');
            var baseUrl = "/Admin/User/index.html";
            var self = this;

            var getUserList = D('User');
            var getPage = self.get("page");
            getUserList.getList(getPage).then(function (data) {
                var pager = new Pager(data, baseUrl);
                self.assign({'userList':data.data,total:data.total,'userCount':data.count});
                return self.display();
            })
        },
        getuseraddresslistAction:function(){
            var self = this;
            var getuserid = self.post('id');
            var userModel = D('user');
            return userModel.getUserAddressList(getuserid).then(function(data){
                return self.end(data);
            })
        },
        getfliterusersdatalistAction:function(){
            var self = this;
            var filterJSON = self.post('fliterjson');
            console.log(filterJSON);
            var pageNum = self.post('pagenum');
            var realFilterJson = JSON.parse(filterJSON);
            var userModel = D('user');
            userModel.getFilterList(realFilterJson,pageNum).then(function(data){
                return self.end(data);
            });
        }
    };
});
