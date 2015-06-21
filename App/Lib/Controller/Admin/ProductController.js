/**
 * Created by wangwenbo on 15/6/6.
 */
/**
 * controller
 * @return
 */
module.exports = Controller("Admin/BaseController", function(){
    "use strict";
    var moment = require('moment');
    var nowDateTime = new Date();
    //var dataAndTime = nowDateTime.getFullYear()+'-'+(nowDateTime.getMonth()+1)+'-'+nowDateTime.getDate()+' '+nowDateTime.getHours()+':'+nowDateTime.getMinutes()+':'+nowDateTime.getSeconds();
    var dataAndTime = moment().format('YYYY-MM-DD HH:mm:ss');
    return {
        indexAction: function(){
            var self = this;
            var getProductList = D('Product');
            return getProductList.getProduct().then(function(data){
                self.assign({'productList':data.days,'activelist':data.active});
                return self.display();
            });

        },
        getinfobyidAction:function(){
            var self = this;
            var selectId = self.post('id');
            var productModel = D('product');
            return productModel.selectById(selectId).then(function(data){
                return self.end(data);
            })
        },
        updateinfobyidAction:function(){
            var self = this;
            var updateID = self.post('id');
            var updatejson = JSON.parse(self.post('json'));
            updatejson.updatetime = dataAndTime;
            var productModel = D('product');
            return productModel.updateById(updateID,updatejson).then(function(data){
                return self.end(data);
            })
        },
        addNewDataForActiveAction:function(){
            var self = this;
            var getNewJSONStr = self.post('json');
            var getRealJson = JSON.parse(getNewJSONStr);
            getRealJson.updatetime = dataAndTime;
            var productModel = D('product');
            return productModel.addData(getRealJson).then(function(data){
                return self.end(data);
            })
        },
        uploadAction:function(){
            var fs = require('fs');
            var self = this;
            var uploadInfo = self.file('file');
            var getDay = self.post('name');
            var newFileName = getDay+".jpg";//+uploadInfo.headers['content-type'].split('/')[1];
            var oldPath = uploadInfo.path;
            var newPath = RESOURCE_PATH+'/resource/img/food/';
            fs.rename(oldPath,newPath+newFileName,function(err){
                if(err){
                    console.error(err);
                }
            });
            return self.end(newFileName);
        }
    };
});