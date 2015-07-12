/**
 * Created by wangwenbo on 15/6/6.
 */
/**
 * 项目里的Controller基类
 * 这里做一些通用的处理逻辑，其他Controller继承该类
 * @param  {[type]}
 * @return {[type]}         [description]
 */
module.exports = Controller(function(){
    'use strict';
    return {
        init: function(http){
            this.super("init", http);
            //其他的通用逻辑
            if(http.action === 'login'||http.controller === 'Wx'){
              console.log(http.controller);
                return;
            }

            var self = this;
            return this.session("userInfo").then(function(data){
                if(isEmpty(data)){
                    return self.redirect('/Admin/login/login')
                }else{
                    self.userInfo = data;
                    self.assign("userInfo",data);
                }
            })
        }
    }
})
