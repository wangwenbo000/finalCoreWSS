define(["vue","jquery"], function(Vue,$) {
  var expressRecord = new Vue({
    el: '#expressOrder',
    data: {
      record: [],
      count: ''
    }
  });

  $('#expressOrder').on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget);
    var getExpresserId = button.data('id');
    $.ajax({
      url: '/Admin/Express/getExpressRecord',
      type: 'POST',
      data: {
        id: getExpresserId
      },
      success: function(data) {
        expressRecord.$data.record = JSON.parse(data).data;
        expressRecord.$data.count = JSON.parse(data).count;
        // 绑定翻页
        bindPager('.page-expressRecord',getExpresserId,JSON.parse(data).total,JSON.parse(data).page);
      }
    })
  });

  function pageAjax(id,num){
      $.ajax({
          url: '/Admin/Express/getExpressRecord',
          type:'post',
          data:{id:id,page:num},
          success:function(data){
              expressRecord.$data.record = JSON.parse(data).data;
              expressRecord.$data.count = JSON.parse(data).count;
          }
      })
  }
  function bindPager(dom,getExpresserId,total,num){
      $(dom).bootpag({
          total:total,
          page:num
      }).on("page",function(event,num){
          pageAjax(getExpresserId,num);
      });
  }
});
