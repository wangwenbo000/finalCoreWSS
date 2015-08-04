define(['vue', 'jquery', 'tooltip'], function(Vue, $, tooltip) {
  $('[data-toggle="tooltip"]').tooltip();
  var orderList = new Vue({
    el: '#orderlist',
    data: {
      order: listJSON,
    },
    filters: {
      
    }
  });
  return {
    orderList: orderList.$data
  }
})
