define(['vue', 'jquery', 'tooltip'], function(Vue, $, tooltip) {
  $('[data-toggle="tooltip"]').tooltip();
  var orderList = new Vue({
    el: '#orderlist',
    data: {
      order: listJSON,
    },
    filters: {
      formatPrice:function(value){
        return parseInt(value).toFixed(2);
      }
    }
  });
  return {
    orderList: orderList.$data
  }
})
