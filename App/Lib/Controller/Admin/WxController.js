/**
 * Created by wangwenbo on 15/6/6.
 *微信控制器
 */
/**
 * controller
 * @return
 */
module.exports = Controller("Admin/BaseController", function(){
    "use strict";
    var Q = require('q');
    return {
        indexAction: function(){

        },
        jsapicofigAction:Q.async(function* (){
          var getURL = this.post('url');
          var jsapi_ticket = yield S('jsapi_ticket');
          var json = WX_sign(jsapi_ticket,getURL);
          this.end(json);
        }),
        unifiedorderAction:Q.async(function* (){
          var self = this;
          var rp = require('request-promise');
          var xml2js = require('xml2js');
          var moment = require('moment');

          var json2XML = new xml2js.Builder();
          var xml2JSON = new xml2js.Parser({explicitArray:false});

          var out_trade_no = this.post('out_trade_no');
          var total_fee = this.post('total_fee');
          var url = this.post('url');
          var attach = this.post('attach');
          var jsapi_ticket = yield S('jsapi_ticket');
          var openid = yield this.session('userInfo');
          var nonce_str = WX_createNonceStr();

          var signjson = {
            appid:'wxde2277be54c81c1d',
            mch_id:'1225961202',
            nonce_str:nonce_str,
            body:'阳光暖心早餐!早安早安',
            out_trade_no:out_trade_no,
            attach:attach,
            total_fee:total_fee*100,
            spbill_create_ip:this.ip(),
            notify_url:'http://www.izaoan.cn/Admin/wx/wxpayrequest',
            trade_type:'JSAPI',
            openid:openid[0]['openid']
          }
          var paySign = WX_PAY_sign(signjson,"lower");
          signjson.sign = paySign;
          var postXML = json2XML.buildObject(signjson);

          var unifiedorderJSON = {
            url:'https://api.mch.weixin.qq.com/pay/unifiedorder',
            method:'POST',
            body:postXML,
            agentOptions:{passphrase: signjson.mch_id}
          }
          var unifiedorderData = yield rp(unifiedorderJSON);
          xml2JSON.parseString(unifiedorderData,function(err,result){
            if(!isEmpty(result.xml.prepay_id)){
            var backJsonForPay = {
                appId:"wxde2277be54c81c1d",//公众号名称，由商户传入
                timeStamp:moment().format('X'),//时间戳，自1970年以来的秒数
                nonceStr:nonce_str,//随机串
                package:"prepay_id="+result.xml.prepay_id,
                signType:"MD5",//微信签名方式：
              }
              var backJsonForPay_sign = WX_PAY_sign(backJsonForPay,"normal");
              backJsonForPay.paySign = backJsonForPay_sign;
              self.success(backJsonForPay);
            }
          });
        }),
        wxpayrequestAction:Q.async(function*(){
          var xml2js = require('xml2js');
          var json2XML = new xml2js.Builder();
          var xml2JSON = new xml2js.Parser({explicitArray:false});
          var payModel = D('Payinfo');
          var requestResult = null;
          var self = this;
          if(this.isPost()){
            var wxRequestData = this.post();
            for(var k in wxRequestData){
              var wxRequestData_Xml = k;
            }
            xml2JSON.parseString(wxRequestData_Xml,function (err,result){
              requestResult = result.xml;
            });

            var isSave = yield payModel.where({'attach':requestResult.attach}).select();
            if(requestResult.result_code==="SUCCESS"&&requestResult.result_code==="SUCCESS"){
              var changeOrderState = yield D('Orderproductcopy').where({orderid:requestResult.attach}).update({
                productstate:"30"
              })
            }
            if(isEmpty(isSave)){
              var data = yield payModel.add(requestResult);
              if(!isEmpty(data)){
                var payCompleteJson = {
                  return_code:"SUCCESS"
                }
                var payOk = json2XML.buildObject(payCompleteJson);
                self.end("SUCCESS");
              }
            }
          }
        })
    };
});
