module.exports = Model(function() {
  function isCallMeUpFilter(data) {
    for (var k in data) {
      switch (data[k].iscallmeup) {
        case '1':
          data[k].iscallmeup = '是';
          break;
        case '0':
          data[k].iscallmeup = '否';
          break;
        default:
          data[k].iscallmeup = "异常!"
      }
    }
  }
  return {
    //获取用户列表
    getorderlist: function(getPage) {
      var moment = require('moment');
      return D('Orderproductcopy').where({
        'time': moment().add(1,'days').format('YYYY-MM-DD')
      }).order('id DESC').page(getPage, 20).countSelect().then(function(data) {
        staticFilter(data.data);
        formatTime(data.data,'YYYY-MM-DD dddd','time');
        return data;
      });
    },
    getstatecount: function(data) {
      return D('Orderproductcopy').where({
        'productstate': ['=', data]
      }).countSelect().then(function(data) {
        return data;
      });
    },
    getorderinfobyid: function(id) {
      return D('Orderproductcopy').where({
        'id': id
      }).select().then(function(data) {
        staticFilter(data);
        isCallMeUpFilter(data);
        return data;
      })
    },
    getattachmentinfo: function(orderid, pointid) {
      var attachmentJSON = {};
      return D('Order').where({
        'id': orderid
      }).select().then(function(data) {
        for (var k in data) {
          switch (data[k].orderfrom) {
            case 2:
              data[k].orderfrom = "PC用户";
              data[k].orderstate = "warning";
              break;
            case 1:
              data[k].orderfrom = "微信用户";
              data[k].orderstate = "success";
              break;
            default:
              data[k].orderfrom = "未知终端";
              data[k].orderstate = "danger";
          }
        }
        formatTime(data, 'llll', 'ordertime');
        attachmentJSON.attachment = data[0];
        return {
          'json': data,
          'now': pointid
        };
      }).then(function(data) {
        var pointId = parseInt(data.now);
        var userId = data.json[0].userid;
        var Ptotal = 0
        return D('Orderproductcopy').where({
          'orderid': data.json[0].id
        }).select().then(function(data) {
          staticFilter(data);
          isCallMeUpFilter(data);
          for (var k in data) {
            Ptotal += data[k].productnum;
            switch (data[k].id) {
              case pointId:
                data[k].thisPoint = "warning";
                break;
              default:
                data[k].thisPoint = 'a';
            }
          }
          formatTime(data, 'YY-MM-DD dddd', 'time');
          attachmentJSON.attach = data;
          attachmentJSON.attachment.countDays = data.length;
          attachmentJSON.attachment.productTotal = Ptotal;
          return userId;
        });
      }).then(function(userid) {
        return D('Users').where({
          'id': userid
        }).select().then(function(data) {
          attachmentJSON.userInfo = data[0];
          return attachmentJSON;
        });
      })
    },
    orderfilter: function(json, getPage) {
      return D('Orderproductcopy').where(json).order('id DESC').page(getPage, 20).countSelect().then(function(data) {
        staticFilter(data.data);
        isCallMeUpFilter(data.data);
        formatTime(data.data,'YYYY-MM-DD dddd','time');
        return data;
      });
    }
  }
})
