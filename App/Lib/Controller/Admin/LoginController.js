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
        loginAction:function(){
            var self = this;

            if(self.isAjax()){
                var userName = self.post("username");
                var passWord = self.post("password");
                return D("Admin").where({
                    username:userName,
                    password:md5(passWord+'goodmorning1288zwc')
                }).find().then(function(data){
                    if(isEmpty(data)){
                        return self.error();
                    }else{
                        return self.session("userInfo",data);
                    }
                }).then(function(){
                    //return self.redirect('/Admin/index');
                    return self.success();
                })
            }else{
                return self.display();
            }
        },
        loginoutAction: function () {
            var self = this;
            self.session('userInfo','');
            self.redirect('login');
        }
    };
});