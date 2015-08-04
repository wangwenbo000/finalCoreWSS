define(['vue'],function(Vue){
  var productList = new Vue({
      el:'#productlist',
      data:{products:dataJSONdays},
      filters:{
          formatPrice:function(value){
            return parseInt(value).toFixed(2);
          }
      }
  });
});
