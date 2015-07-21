/**
 * Created by wangwenbo on 15/6/6.
 */
/**
 * controller
 * @return
 */
module.exports = Controller("Admin/BaseController", function(){
    "use strict";
    var Q = require('q');
    var expressDataModel = D('Express');
    return {
        indexAction: Q.async(function* (){
          var data = yield expressDataModel.getExpressList();
          this.assign({expresslist:data});
          return this.display();
        }),
        addnewexpressAction:Q.async(function* (){
          var getData = JSON.parse(this.post('data'));
          var data = yield expressDataModel.addExpress(getData);
          return this.success({rowId:data});
        }),
        editexpressAction:Q.async(function* (){
          var getId = this.post('id');
          var data = yield expressDataModel.getExpressInfo(getId);
          return this.success({info:data});
        }),
        delexpressAction:Q.async(function* (){
          var getId = parseInt(this.post('id'));
          var data = yield expressDataModel.where({id:getId}).delete();
          return this.success({info:data});
        }),
        getExpressRecordAction:Q.async(function* (){
          var getId = parseInt(this.post('id'));
          var data = yield D('Orderproductcopy').where({expresserid:getId}).order('ID DESC').countSelect();
          staticFilter(data.data);
          formatTime(data.data,'YYYY-MM-DD dddd','time')
          return this.end(data);
        })
    };
});
