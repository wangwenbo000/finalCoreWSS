define(['vue', 'jquery', 'orderList', 'orderPage'], function(Vue, $, oData, bPage) {
  $('#expressAllocation').affix({
    offset: {
      top: 360,
    }
  })
  var formfliter = new Vue({
    el: '#formfliter',
    data: {
      searchC: '*',
      productstate: '*',
      expresstime: '*',
      iscallmeup: '*',
      logic: 'AND',
      address: yuntu,
      addressKey:'*'
    },
    computed: {
      outPutFilterJson: function() {
        var json = {};
        if (this.searchC != '*') {
          json[this.searchC] = this.searchV;
        }
        if (this.productstate != '*') {
          json['productstate'] = this.productstate;
        }
        if (this.expresstime != '*') {
          json['expresstime'] = this.expresstime;
        }
        if (this.logic != 'AND') {
          json['_logic'] = this.logic;
        }
        if (this.iscallmeup != '*') {
          json['iscallmeup'] = this.iscallmeup;
        }
        if ($('#flitertime').attr('value') != '') {
          json['time'] = $('#flitertime').attr('value');
        }
        if(this.addressKey != '*'){
          json['addressKey'] = this.addressKey;
        }
        return json;
      }
    }
  });

  //点击按钮筛选
  $('button[class~=fliterBtn]').on('click', function() {
    var btnstatic = $(this).button('loading');
    var filterJsonStr = JSON.stringify(formfliter.outPutFilterJson);
    // console.log(getFliterJson);
    $.ajax({
      url: '/Admin/Order/filter',
      type: 'post',
      data: {
        'fliterjson': filterJsonStr
      },
      success: function(data) {
        oData.orderList.order = JSON.parse(data).data;
        btnstatic.button('reset');
        var str2json = JSON.parse(data);
        // if(str2json.data.length!=0){
        //   $('.alert').css({display:"none"});
        // }else{
        //   $('.alert').css({display:"block"});
        // }
        //绑定翻页
        bPage.bindPagerFn('.page-selection-top', '.page-selection-bottom', filterJsonStr, str2json.total);
        bPage.bindPagerFn('.page-selection-bottom', '.page-selection-top', filterJsonStr, str2json.total);
      }
    });
  });
})
