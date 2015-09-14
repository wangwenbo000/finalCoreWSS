  // var bPage = require("./orderPage.js");
  var orderList = new Vue({
    el: '#orderlist',
    data: {
      checked:false,
      order: listJSON,
      orderStateActionJson:{},
    },
    ready:function(){
      $('.page-selection-top').bootpag({
        total:total,
        page: 1,
        maxVisible: 20,
      })
    },
    methods:{
      changeOrderStateAction:function(state,order,index){
        var self = this;
        $('#checkmodal').on('show.bs.modal', function (e) {
          self.orderStateActionJson={state:state,order:order,index:index};
        });
      },
      doOrderStateAction:function(){
        switch (this.orderStateActionJson.state) {
          case 'pay':
          this.changeStateFn('changeOrderStatePay','待支付','30');
            break;
          case 'complete':
          this.changeStateFn('changeOrderStateComplete','已成功','55');
            break;
          case 'cancel':
          this.changeStateFn('changeOrderStateCancel','已取消','60');
            break;
          default:
        }
      },
      changeStateFn:function(url,statetxt,statenum){
        console.log(url,statetxt,statenum);
        $.ajax({
          url:'/Admin/Order/'+url,
          type:'POST',
          data:{id:this.orderStateActionJson.order.orderid},
          success:function(){
            $('#checkmodal').modal('hide');
            var index = orderList.orderStateActionJson.index;
            console.log(url,statetxt,statenum,index);
            orderList.order[index].productstatenum = statenum;
            orderList.order[index].productstate = statetxt;
            orderList.order.$set(index, orderList.order[index]);
          }
        });
      }
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
            // bindPager(filterJsonStr, filterData.total);
            // {pagenum, filterjson}
            createPager(filterJsonStr,filterData.total);
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
              createPager(filterJsonStr,filterData.total)
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
            createPager(filterJsonStr,filterData.total);
          });
        },
        reset:function(){
          formfliter.reset();
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
              $('#allocationSuccess').modal('show');
            }
          });
        }
      }
    });

    function createPager(json,_total){
      $('.page-selection-top').bootpag({
        total:_total,
        page: 1,
        maxVisible: 20,
      }).on('page',function(event,num){
        var self = $(this);
        $.ajax({
          url: '/Admin/Order/filter',
          type:'post',
          data:{pagenum:num,fliterjson:json},
          success:function(data){
              orderList.order = JSON.parse(data).data;
              self.bootpag({
                total:JSON.parse(data).total,
                page:num,
                maxVisible:30
              });
          }
        })
      })
    }
