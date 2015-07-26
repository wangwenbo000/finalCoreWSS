define(['jquery','bootpag','expresslist'],function($,bootpag,eData){
    function pageAjax(json){
        $.ajax({
            url: '/Admin/express/filter',
            type:'post',
            data:json,
            success:function(data){
                eData.listData.express = JSON.parse(data).data;
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
