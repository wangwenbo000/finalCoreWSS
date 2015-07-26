define(['bootpag','orderList'],function(bootpag,oData){
  function pageAjax(json){
      $.ajax({
          url: '/Admin/Order/filter',
          type:'post',
          data:json,
          success:function(data){
              oData.orderList.order = JSON.parse(data).data;
          }
      })
  }
  function bindPager(top,bottom,json,total){
      $(top).bootpag({
          total:total
      }).on("page",function(event,num){
          pageAjax({pagenum:num,fliterjson:json});
          $(bottom).bootpag({
              total:total,
              page:num
          });
      });
  }
  //初次加载绑定头部底部翻页
  bindPager('.page-selection-top','.page-selection-bottom','{}',total);
  bindPager('.page-selection-bottom','.page-selection-top','{}',total);

  return {
    bindPagerFn: bindPager
  }
})
