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
            self.display();
        },
        _404Action: function(){
            this.status(404); //发送404状态码
            this.end('404 not found');
        }
    };
});