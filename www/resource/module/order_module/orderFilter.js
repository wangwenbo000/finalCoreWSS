  // var bPage = require("./orderPage.js");
  var orderList = new Vue({
    el: '#orderlist',
    data: {
      checked:false,
      order: listJSON,
    },
    filters:{
      cut:function(val){
        return val.substr(0,14)+"...";
      },
      allocation:function(val){
        return val==null?val:"<i class='glyphicon glyphicon-star'></i>";
      }
    }
  });
  $('#expressAllocation').affix({
    offset: {top: 360}
  })
    var formfliter = new Vue({
      el: '#formfliter',
      data: {
        searchC: '*',
        productstate: '*',
        expresstime: '*',
        iscallmeup: '*',
        logic: 'AND',
        addressKey:'*'
      },
      methods:{
        filter:function(){
          var btnstatic = $(this).button('loading');
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
          if ($('#flitertime').attr('value') != '') {
            json['time'] = $('#flitertime').attr('value');
          }

          var filterJsonStr = JSON.stringify(json);
          $.ajax({
            url: '/Admin/Order/filter',
            type: 'post',
            data: {
              'fliterjson': filterJsonStr
            }
          }).done(function(data){
            var filterData = JSON.parse(data);
            orderList.order = filterData.data;
            btnstatic.button('reset');
            //绑定翻页
            bindPager(filterJsonStr, filterData.total);
          })
        },
        reset:function(){
          this.$data={
            searchC: '*',
            productstate: '*',
            expresstime: '*',
            iscallmeup: '*',
            logic: 'AND',
            addressKey:'*'
          }
          var filterJsonStr = JSON.stringify({time:addressKey.nextday});
          $.ajax({
            url:'/Admin/Order/filter',
            data:{"fliterjson":filterJsonStr},
            type:'post',
            success:function(data){
              var filterData = JSON.parse(data);
              orderList.order = filterData.data;
              bindPager(filterJsonStr, filterData.total);
            }
          })
        }
      }
    });

    var addressKey = new Vue({
      el:"#expressAddress",
      data:{
        todayAddress:expressAddress,
        nextday:nextDay
      },
      methods:{
        addressKeyFilter:function(val){
          var filterJsonStr = JSON.stringify({addressKey:val,time:this.nextday});
          $.ajax({
            url:'/Admin/Order/filter',
            data:{"fliterjson":filterJsonStr},
            type:'post'
          }).done(function(data){
            var filterData = JSON.parse(data);
            orderList.order = filterData.data;
          });
        }
      }
    });

    var expressAllocation = new Vue({
      el: '#expressAllocation',
      data: {
        selected: '',
        expressData: express
      },
      methods: {
        allocation: function() {

          var checkOrder = $('input[name=checkorder]');
          var updateOrderIdArr = [];
          checkOrder.each(function() {
            if ($(this).prop('checked') == true) {
              updateOrderIdArr.push(parseInt($(this).prop('value')));
            }
          });

          $.ajax({
            url: '/Admin/Order/allocation',
            type: 'POST',
            data: {
              updateId: JSON.stringify(updateOrderIdArr),
              data: expressAllocation.$data.selected
            },
            success: function(data) {
              console.log(data);
              $('#allocationSuccess').modal('show');
            }
          });
        }
      }
    });

// 绑定翻页初始化
function pageAjax(json){
    $.ajax({
        url: '/Admin/Order/filter',
        type:'post',
        data:json,
        success:function(data){
            orderList.order = JSON.parse(data).data;
        }
    })
}
function bindPager(json,total){
    $('.page-selection-top, .page-selection-bottom').bootpag({
        total:total,
        page: 1,
        maxVisible: 30,
    }).on("page",function(event,num){
        pageAjax({pagenum:num,fliterjson:json});
    });
}
bindPager('{}',total);
