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
     * TODO:获取订单列表 get_orderList()
     * todo:准确匹配id,并将id转为小写
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
      var startPage = isNumber(oConfigJson.startPage) ? parseInt(oConfigJson.startPage) : 0;//配置开始页面
      var pageNum = isNumber(oConfigJson.pageNum) ? parseInt(oConfigJson.pageNum) : 20;//配置每页显示数量

      var whereCaseJson = isEmpty(oConfigJson.where) ? {} : oConfigJson.where;
      var orderCaseStr = isEmpty(oConfigJson.order) ? "id DESC" : oConfigJson.order;
      var dinstinctCaseStr = isEmpty(oConfigJson.distinct) ? "" : oConfigJson.distinct;
      var fieldCaseStr = isEmpty(oConfigJson.field) ? "" : /id/i.test(oConfigJson.field) ? oConfigJson.field : oConfigJson.field + ",id";

      if (isEmpty(oConfigJson)) {
        return yield D('Orderproductcopy').order('id DESC').page(startPage, pageNum).countSelect();
      } else if (isObject(oConfigJson) && !isEmpty(oConfigJson)) {
        return yield D('Orderproductcopy').where(whereCaseJson).distinct(dinstinctCaseStr).field(fieldCaseStr).order(orderCaseStr).page(startPage, pageNum).countSelect();
      }
    }),
    /**
     * TODO:操作订单状态 update_orderState()
     * HTTP/POST
     * oConfigJson = {
     *  state:    [Object] | success | waitPay | waitExpress | cancel | refound,
     * }
     */
    update_orderState: Q.async(function*(oConfigJson) {
      if (isObject(oConfigJson) && !isEmpty(oConfigJson)) {
        var nowState = null;
        var whereCaseJson = oConfigJson.where;
        switch (oConfigJson.state) {
          case "success":
            nowState = '55';
            break;
          case "waitPay":
            nowState = '10';
            break;
          case "waitExpress":
            nowState = '30';
            break;
          case "cancle":
            nowState = '60';
            break;
          case "refound":
            nowState = '44';
            break;
          default :
            return "";
        }
        return yield D('Orderproductcopy').where(whereCaseJson).update({
          productstate: nowState
        });
      } else {

      }
    }),
    /**
     * 获取订单详细信息 get_orderMainInfo()
     * HTTP/POST
     * oConfigJson = {
     *  where:{id:[Number]}
     * }
     */
    get_orderMainInfo: Q.async(function*(selectIdJson) {
      if (isObject(selectIdJson) && !isEmpty(selectIdJson)) {
        var userOrderList = yield D('Orderproductcopy').field("orderid,productname,singleprice,productstate").where({orderid: selectIdJson.orderid}).select();
        var sqlStr = "SELECT *,";
        sqlStr += "(SELECT COUNT(*) FROM `king_orderproductcopy` WHERE ( `orderid` = " + selectIdJson.orderid + " )) as listLength,";
        sqlStr += "(SELECT COUNT(*) FROM `king_orderproductcopy` WHERE ( `orderid` = " + selectIdJson.orderid + " AND `productstate` = 55 )) as complete, ";
        sqlStr += "(SELECT COUNT(*) FROM `king_orderproductcopy` WHERE ( `orderid` = " + selectIdJson.orderid + " AND `productstate` = 30 )) as waitExpress ";
        sqlStr += "FROM `king_order` ";
        sqlStr += "RIGHT JOIN king_Orderproductcopy ON king_order.id=king_Orderproductcopy.orderid ";
        sqlStr += "LEFT JOIN king_payinfo ON king_order.id=king_payinfo.attach ";
        sqlStr += "HAVING king_Orderproductcopy.id=" + selectIdJson.orderlistid;
        var userOrderInfo = yield D('Order').query(sqlStr);

        userOrderInfo[0].orderlist = userOrderList;
        return userOrderInfo;
      }
    }),
  }
})
