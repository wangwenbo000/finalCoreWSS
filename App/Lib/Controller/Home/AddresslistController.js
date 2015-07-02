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
            self.session('userInfo').then(function(data){
                return D('Addresslist').where({'userid':data[0].id}).order('id DESC').select().then(function(data){
                    self.assign('addresslist',data);
                    self.display();
                });
            });
        }
    };
});