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

            if(self.isPost()){
                var userName = self.post("username");
                var passWord = self.post("password");
                return D("Admin").where({
                    username:userName,
                    password:passWord
                }).find().then(function(data){
                    if(isEmpty(data)){
                        console.log(data);
                        return self.error(403,"用户名密码错误");
                    }else{
                        console.log(data);
                        return self.session("userInfo",data);
                    }
                }).then(function(){
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