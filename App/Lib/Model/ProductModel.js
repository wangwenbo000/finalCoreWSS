module.exports = Model(function () {
  var Q = require('q');
  return {
    //获取用户列表
    getProduct: function (getPage) {
      var json = {};
      return D('Products').where({'isactive': '0'}).order('id DESC').select().then(function (data) {
        formatTime(data, 'L', 'updatetime');
        json.days = data;
      }).then(function () {
        return D('Products').where({'isactive': '1'}).order('id DESC').select().then(function (data) {
          formatTime(data, 'L', 'updatetime');
          json.active = data;
          return json;
        })
      })
    },
    selectById: function (id) {
      return D('Products').where({'id': id}).select().then(function (data) {
        return data;
      });
    },
    updateById: function (id, json) {
      return D('Products').where({'id': id}).update(json).then(function (affectedRows) {
        return affectedRows;
      })
    },
    addData: function (json) {
      return D('Products').add(json).then(function (insertId) {
        return insertId;
      })
    },

    get_productList:Q.async(function*(oConfigJson){

      var whereCaseJson = isEmpty(oConfigJson.where) ? {} : oConfigJson.where;
      var orderCaseStr = isEmpty(oConfigJson.order) ? "id DESC" : oConfigJson.order;
      var fieldCaseStr = isEmpty(oConfigJson.field) ? "" : /id/i.test(oConfigJson.field) ? oConfigJson.field : oConfigJson.field + ",id";

      if (isEmpty(oConfigJson)) {
        return yield D('Products').order('id DESC').select();
      } else if (isObject(oConfigJson) && !isEmpty(oConfigJson)) {
        return yield D('Products').where(whereCaseJson).field(fieldCaseStr).order(orderCaseStr).select()
      }
    })

  }
})