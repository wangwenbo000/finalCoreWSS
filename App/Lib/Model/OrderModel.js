module.exports = Model(function () {
  var Q = require("q");
  var moment = require('moment');
  var nextDay = moment().add(1, 'days').format('YYYY-MM-DD');
  return {
    //获取用户列表
    getorderlist: function (getPage) {
      return D('Orderproductcopy').where({'time': nextDay}).order('id DESC').page(getPage, 20).countSelect().then(function (data) {
        staticFilter(data.data);
        formatTime(data.data, 'YYYY-MM-DD dddd', 'time');
        return data;
      });
    },
    expressAddress: Q.async(function* () {
      return yield D('Orderproductcopy').where({'time': nextDay}).distinct('addressKey').select();
    }),
    getstatecount: function (data) {
      return D('Orderproductcopy').where({
        'productstate': ['=', data]
      }).countSelect().then(function (data) {
        return data;
      });
    },
    getorderinfobyid: function (id) {
      return D('Orderproductcopy').where({
        'id': id
      }).select().then(function (data) {
        staticFilter(data);
        return data;
      })
    },
    getattachmentinfo: function (orderid, pointid) {
      var attachmentJSON = {};
      return D('Order').where({
        'id': orderid
      }).select().then(function (data) {
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
      }).then(function (data) {
        var pointId = parseInt(data.now);
        var userId = data.json[0].userid;
        var Ptotal = 0
        return D('Orderproductcopy').where({
          'orderid': data.json[0].id
        }).select().then(function (data) {
          staticFilter(data);
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
      }).then(function (userid) {
        return D('Users').where({
          'id': userid
        }).select().then(function (data) {
          attachmentJSON.userInfo = data[0];
          return attachmentJSON;
        });
      })
    },
    orderfilter: function (json, getPage) {
      return D('Orderproductcopy').where(json).order('id DESC').page(getPage, 20).countSelect().then(function (data) {
        // console.log(data);
        staticFilter(data.data);
        formatTime(data.data, 'YYYY-MM-DD dddd', 'time');
        return data;
      });
    },
    /**
     * 获取订单列表 get_orderList()
       * HTTP/POST
     * oConfigJson = {
     *  where:    [Object],
     *  distinct: [String],
     *  field:    [String],
     *  order:    [String],
     *  starPage: [Number],
     *  pageNum   [Number]:
     * }
     */
    get_orderList: Q.async(function*(oConfigJson) {
      var startPage = isNumber(oConfigJson.startPage)?parseInt(oConfigJson.startPage):0; //配置开始页面
      var pageNum = isNumber(oConfigJson.pageNum)?parseInt(oConfigJson.pageNum):20;//配置每页显示数量

      var whereCaseJson = isEmpty(oConfigJson.where)?{}:oConfigJson.where;
      var orderCaseStr = isEmpty(oConfigJson.order)?"id DESC":oConfigJson.order;
      var dinstinctCaseStr = isEmpty(oConfigJson.distinct)?"":oConfigJson.distinct;
      var fieldCaseStr = isEmpty(oConfigJson.field)?"":oConfigJson.field;

        if (isEmpty(oConfigJson)) {
          return yield D('Orderproductcopy').order('id DESC').page(startPage, pageNum).countSelect();
        } else if (isObject(oConfigJson)&&!isEmpty(oConfigJson)){
          return yield D('Orderproductcopy').field(fieldCaseStr).where(whereCaseJson).distinct(dinstinctCaseStr).order(orderCaseStr).page(startPage, pageNum).countSelect();
        }
    }),
  }
})
