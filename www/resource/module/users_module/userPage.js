define(['vue', 'bootpag', 'userlist'], function(Vue, bootpag, uData) {
  function pageAjax(json) {
    $.ajax({
      url: '/Admin/User/getfliterusersdatalist',
      type: 'post',
      data: json,
      success: function(data) {
        uData.userListData.userlist = JSON.parse(data).data;
      }
    })
  }

  function bindPager(top, bottom, json, total) {
    $(top).bootpag({
      total: total
    }).on("page", function(event, num) {
      pageAjax({
        pagenum: num,
        fliterjson: json
      });
      $(bottom).bootpag({
        total: total,
        page: num
      });
    });
  }

  bindPager('.page-selection-top', '.page-selection-bottom', '{}', total);
  bindPager('.page-selection-bottom', '.page-selection-top', '{}', total);

  return {
    bindPagerFn: bindPager
  }
})
