/**
 * Created by wangwenbo on 15/6/6.
 */
/**
 * controller
 * @return
 */
module.exports = Controller("Admin/BaseController", function () {
  "use strict";
  var moment = require('moment');
  var Q = require('q');
  var nowDateTime = new Date();
  //var dataAndTime = nowDateTime.getFullYear()+'-'+(nowDateTime.getMonth()+1)+'-'+nowDateTime.getDate()+' '+nowDateTime.getHours()+':'+nowDateTime.getMinutes()+':'+nowDateTime.getSeconds();
  var dataAndTime = moment().format('YYYY-MM-DD HH:mm:ss');
  return {
    indexAction: Q.async(function* () {
      var data = yield D('Product').getProduct();
      this.assign({'productList': data.days, 'activelist': data.active});
      this.display();
    }),
    getinfobyidAction: function () {
      var self = this;
      var selectId = self.post('id');
      var productModel = D('product');
      return productModel.selectById(selectId).then(function (data) {
        return self.end(data);
      })
    },
    updateinfobyidAction: function () {
      var self = this;
      var updateID = self.post('id');
      var updatejson = JSON.parse(self.post('json'));
      updatejson.updatetime = dataAndTime;
      var productModel = D('product');
      return productModel.updateById(updateID, updatejson).then(function (data) {
        return self.end(data);
      })
    },
    addNewDataForActiveAction: function () {
      var self = this;
      var getNewJSONStr = self.post('json');
      var getRealJson = JSON.parse(getNewJSONStr);
      getRealJson.updatetime = dataAndTime;
      var productModel = D('product');
      return productModel.addData(getRealJson).then(function (data) {
        return self.end(data);
      })
    },
    uploadAction: function () {
      var fs = require('fs');
      var self = this;
      var uploadInfo = self.file('productimg');
      var getId = self.post('id');
      console.log(getId);
      var newFileName = moment().format('YYYYMMDDHHmmss') + ".jpg";//+uploadInfo.headers['content-type'].split('/')[1];
      var oldPath = uploadInfo.path;
      var newPath = RESOURCE_PATH + '/resource/img/food/' + moment().format('YYYYMM') + '/';
      fs.existsSync(newPath) || fs.mkdirSync(newPath);
      var newImgName = moment().format('YYYYMM') + '/' + newFileName;
      fs.rename(oldPath, newPath + newFileName, function (err) {
        if (err) {
          console.error(err);
        } else {
          D('Products').where({id: getId}).update({
            foodimg: newImgName
          })
        }
      });
      return self.end({append: true, filename: newImgName});
    },
    /**
     * 获取产品列表
     * HTTP/POST
     * oConfigJson = {
     *  where:    [Object],
     *  field:    [String],
     *  order:    [String],
     * }
     * 默认传参 {"where":{"isactive":0}}
     * 获取一周标准早餐列表
     */
    get_productListAction: Q.async(function*() {
      if (this.isPost()) {
        var oConfigJson = this.post();
        var productListResult = yield D('Product').get_productList(oConfigJson);
        return this.success(productListResult);
      } else {
        return this.error();
      }
    }),
    /**
     * 更新产品信息
     * HTTP/POST
     * oConfigJson = {
     *  where:    [Object],
     * }
     */
    update_productInfoAction: Q.async(function*() {
      if (this.isPost()) {
        var oConfigJson = this.post();
        var productListResult = yield D('Product').update_productInfo(oConfigJson);
        return this.success(productListResult);
      } else {
        return this.error();
      }
    })
  };
});
