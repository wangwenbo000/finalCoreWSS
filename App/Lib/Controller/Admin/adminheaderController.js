/**
 * Created by wangwenbo on 15/6/8.
 */
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
            console.log('a');
            this.display();
        }
    };
});