//配送列表
define(['vue'], function(Vue) {
  var expresslist = new Vue({
    el: '#expresslist',
    data: {
      express: expressJSON.data
    },
    filters: {
      state2show: function(value) {
        switch (value) {
          case 1:
            return "在职";
            break;
          case 0:
            return "离职";
            break;
        }
      },
      power2show: function(value) {
        switch (value) {
          case 1:
            return "组长";
            break;
          case 0:
            return "职员";
            break;
        }
      },
    }
  });
  return {
    listData:expresslist.$data
  }
});
