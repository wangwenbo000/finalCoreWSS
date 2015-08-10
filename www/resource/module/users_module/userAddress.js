define(['vue','jquery'], function(Vue,$) {
  var getAddressList = new Vue({
    el: "#address",
    data: {
      addressListCount: '',
      addressList: ''
    }
  });

  $('#usermodal').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget);
      var userId = button.data('id');
      $(this).find('.modal-title').text('查看早餐详情 ID：'+userId);
      //加载单比订单
      $.ajax({
          url: '/Admin/user/getuseraddresslist',
          type:'post',
          data:{'id':userId},
          success:function(data){
              getAddressList.$data.addressList = JSON.parse(data).data;
              getAddressList.$data.addressListCount = JSON.parse(data).count;
          }
      });
  });
});
