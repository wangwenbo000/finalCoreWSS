define(['vue','jquery'],function(Vue,$){
  var orderSingleInfo = new Vue({
      el:'#singleorderinfo',
      data:{},
      filters:{
        formatPrice:function(value){
          return parseInt(value).toFixed(2);
        }
      }
  });

  var attachmentInfo = new Vue({
      el:'#attachmentinfo',
      data:{},
      filters:{
        formatPrice:function(value){
          return parseInt(value).toFixed(2);
        }
      }
  });

  //模态打开时的操作
  $('#orderModel').on('show.bs.modal', function (event) {
      var nowbotton = event.relatedTarget.className;
      if(nowbotton=='orderAttachment'){
          $('#orderTab li:eq(1) a').tab('show');
      }else if(nowbotton=='orderInfo'){
          $('#orderTab a:first').tab('show');
      }
      var button = $(event.relatedTarget);
      var orderId = button.data('id');
      var ordernum = button.data('orderid');
      var orderAttachmentId = button.data('select');
      $(this).find('.modal-title').text('查看早餐详情 ID：'+orderId);
      //加载单比订单
      $.ajax({
          url: '/Admin/order/getsingleorderinfo',
          type:'post',
          data:{'id':orderId},
          success:function(data){
              orderSingleInfo.$data = JSON.parse(data)[0];
          }
      });
      //加载依附关系订单
      $.ajax({
          url: '/Admin/order/getattachmentinfo',
          type:'post',
          data:{'id':orderAttachmentId,'pointid':orderId},
          success:function(data){
              attachmentInfo.$data = JSON.parse(data);
          }
      });
  });
})
