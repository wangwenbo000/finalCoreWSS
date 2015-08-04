/**
 * Created by wangwenbo on 15/6/6.
 */
/**
 * controller
 * @return
 */
module.exports = Controller("Admin/BaseController", function(){
    "use strict";
    var  Q = require('q');
    return {
        indexAction: Q.async(function* (){
            var rp = require('request-promise');
            var baseUrl = "/Admin/order/index.html";
            var orderModel = D('Order');
            var data = yield orderModel.getorderlist(this.get('page'));

            var expressData = yield D('Express').order('ID DESC').field(['name','id']).select();
            var ExpressSelectData = [];
            for(var k in expressData){
              var ExpressSelectJson = {};
              ExpressSelectJson['text'] = expressData[k].name;
              ExpressSelectJson['value'] = expressData[k].id;
              ExpressSelectData.push(ExpressSelectJson);
            }

            var yuntu = {
              url:'http://yuntuapi.amap.com/datasearch/local',
              qs:{key:'4af78342937c8140440f75c9809063c5',
                  tableid:'5588fe0be4b062df8bcd62da',
                  keywords:' ',
                  grant_type:'authorization_code',
                  city:'北京市'
                },
              method:'GET'
            }
            var addressData = yield rp(yuntu);
            addressData = JSON.parse(addressData);

            var ExpressAddressData = [];
            for(var k in addressData.datas){
              var ExpressAddressJson = {};
              ExpressAddressJson['text'] = addressData['datas'][k]['_name'];
              ExpressAddressJson['value'] = addressData['datas'][k]['_name'];
              ExpressAddressData.push(ExpressAddressJson);
            }
            ExpressAddressData.unshift({'text':'请选择筛选配送区域','value':'*'});
            for(var k in data.data){
              if(isEmpty(data.data[k].expresserid)){
                data.data[k].showAllocation = "display:none";
                data.data[k].showCheckBox = '';
              }else{
                data.data[k].showAllocation = '';
                data.data[k].showCheckBox = 'display:none';
              }
            }
            this.assign({'listJSON':data.data,'total':data.total,'count':data.count,'express':ExpressSelectData,'yuntu':ExpressAddressData});

            // 共<%=count%>单 | 已发货
            // <%=stateCount.HAS_POST%>单 | 已成功
            // <%=stateCount.HAS_SUCC%>单 | 待付款
            // <%=stateCount.WAIT_PAY%>单 | 待发货
            // <%=stateCount.WAIT_POST%>单 | 待退款
            // <%=stateCount.WAIT_REFUND%>单 | 已退款
            // <%=stateCount.HAS_REFUND%>单 | 已取消
            // <%=stateCount.HAS_CANCEL%>单 | 异常
            // <%=stateCount.ERROR%>单

            // var stateJsonCase = {
            //     "HAS_SUCC":'55',
            //     "HAS_POST":'33',
            //     "WAIT_PAY":'10',
            //     "WAIT_POST":'30',
            //     "WAIT_REFUND":'40',
            //     "HAS_REFUND":'44',
            //     "HAS_CANCEL":'60',
            //     "ERROR":'err'
            // };
            //
            // var stateAssignJson = {}
            // var countData = null
            // for(var k in stateJsonCase){
            //   switch (k) {
            //     case "ERROR":
            //       countData = yield orderModel.getstatecount(stateJsonCase[k]);
            //       stateAssignJson[k]=countData.count;
            //       this.assign({stateCount:stateAssignJson});
            //       this.display();
            //       break;
            //     default:
            //       countData = yield orderModel.getstatecount(stateJsonCase[k]);
            //       stateAssignJson[k]=countData.count;
            //   }
            // }
            this.display();
        }),
        allocationAction:Q.async(function* (){
          var getUpdateId = JSON.parse(this.post('updateId'));
          var expresserid = parseInt(this.post('data'));
          var data = yield D('Orderproductcopy').where({id:['IN',getUpdateId]}).update({expresserid:expresserid});
          return this.success({info:data});
        }),
        filterAction:function(){
            var self = this;
            var getJSON = self.post('fliterjson');
            var getPage = self.post('pagenum');
            var orderModel = D('order');
            orderModel.orderfilter( JSON.parse(getJSON),parseInt(getPage)).then(function(data){
                self.assign({'pagenum':data.page});
                for(var k in data.data){
                  if(isEmpty(data.data[k].expresserid)){
                    data.data[k].showAllocation = "display:none";
                    data.data[k].showCheckBox = '';
                  }else{
                    data.data[k].showAllocation = '';
                    data.data[k].showCheckBox = 'display:none';
                  }
                }
                return self.end(data);
            });
        },
        getsingleorderinfoAction:function(){
            var self =this;
            var orderid = self.post('id');
            var orderModel = D('order').getorderinfobyid(orderid).then(function(data){
                return self.end(data);
            })
        },
        getattachmentinfoAction:function(){
            var self = this;
            var getPointId = self.post('pointid');
            var getSelectId = self.post('id');
            var orderModel = D('order').getattachmentinfo(getSelectId,getPointId).then(function(data){
                return self.end(data);
            })
        },
        getpayinfoAction:Q.async(function*(){
          var getOrderId = parseInt(this.post('id'));
          var getPayInfoById = yield D('payinfo').where({'attach':getOrderId}).select();
          formatTime(getPayInfoById, 'llll', 'time_end');
          return this.end(getPayInfoById);
        })
    };
});
