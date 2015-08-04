// 用户组件基本配置
require.config({　　　　
  baseUrl: "/resource/module/",
  　paths: {
    // lib
    "jquery": "lib/jquery-1.11.3.min",
    "vue": "lib/vue.min",
    "bootpag": "lib/jquery.bootpag.min",
    "datetimepicker": "lib/bootstrap-datetimepicker.min",
    // orders
    "orderList": "order/orderList",
    "orderAllocation": "order/orderAllocation",
    "orderDatetimepicker": "order/orderDatetimepicker",
    "orderFilter": "order/orderFilter",
    "orderInfo": "order/orderInfo",
    "orderPage": "order/orderPage",
    "orderQuick": "order/orderQuick",
    // bootstrap
    "dropdown": "lib/bootstrap/dropdown",
    "modal": "lib/bootstrap/modal",
    "tooltip": "lib/bootstrap/tooltip",
    "button": "lib/bootstrap/button",
    "tab": "lib/bootstrap/tab",
    "affix": "lib/bootstrap/affix"
  },
  shim: {
    'dropdown': {
      deps: ['jquery']
    },
    'modal': {
      deps: ['jquery']
    },
    'modal': {
      deps: ['jquery']
    },
    'bootpag': {
      deps: ['jquery']
    },
    'tooltip': {
      deps: ['jquery'],
      exports:"tooltip"
    },
    'button': {
      deps: ['jquery']
    },
    'tab': {
      deps: ['jquery']
    },
    'affix': {
      deps: ['jquery']
    },
    'datetimepicker': {
      deps: ['jquery']
    }
  }
});
// 使用组件
var orderModule = [
  'dropdown',
  'modal',
  'button',
  'tab',
  'affix',
  'orderList',
  'orderAllocation',
  'orderDatetimepicker',
  'orderFilter',
  'orderInfo',
  'orderPage',
  'orderQuick'
];
// 使用
require(orderModule, function() {

});
