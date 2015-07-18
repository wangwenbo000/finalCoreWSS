/**
 * Created by wangwenbo on 15/6/6.
 *微信控制器
 */
/**
 * controller
 * @return
 */
module.exports = Controller("Admin/BaseController", function(){
    "use strict";
    var Q = require('q');
    return {
        indexAction: function(){

        },
        jsapicofigAction:Q.async(function* (){
          var getURL = this.post('url');
          var jsapi_ticket = yield S('jsapi_ticket');
          var json = WX_sign(jsapi_ticket,getURL);
          this.end(json);
        }),
    };
});
