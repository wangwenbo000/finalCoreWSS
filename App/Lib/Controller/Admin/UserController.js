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
                self.assign({'userList':data.data,'pager':pager.render(),'userCount':data.count});
                return self.display();
            })
        }
    };
});