module.exports = Model(function () {
  var Q = require('q');
  return {
    //获取用户列表w
    getUserOrderList: function (id) {
      var json = {};
      return D('Order').where({userid: id, nowstate: ['>', 0]}).order('id DESC').countSelect().then(function (data) {
        formatTime(data.data, 'YYYY-MM-DD', 'ordertime');
        if (data.count == 0) {
          json.progressCount = '';
        } else {
          json.progressCount = data.count;
        }
        json.progress = data.data;
      }).then(function () {
        return D('Order').where({userid: id, nowstate: ['<=', 0]}).order('id DESC').countSelect().then(function (data) {
          formatTime(data.data, 'YYYY-MM-DD', 'ordertime');
          if (data.count == 0) {
            json.completeCount = '';
          } else {
            json.completeCount = data.count;
          }
          json.complete = data.data;
          return json;
        });
      });
    },

    get_userOrderList: Q.async(function*(openid) {
      return yield D('Orderproductcopy').where({openid:openid,productstate:'55'}).order('id DESC').select();
    })

  }
})
