// 用户组件基本配置
require.config({　　　　
  baseUrl: "/resource/module/",
  　paths: {
    // lib
    "jquery": "lib/jquery-1.11.3.min",
    "vue": "lib/vue.min",
    "bootpag": "lib/jquery.bootpag.min",
    "dmuploader":"lib/dmuploader.min",
    "messenger":"lib/messenger.min",

    // products
    "productList":"product/productList",
    "productActive":"product/productActive",
    "productAddActive":"product/productAddActive",
    "productInfo":"product/productInfo",
    "productUpdate":"product/productUpdate",
    // bootstrap
    "dropdown": "lib/bootstrap/dropdown",
    "modal": "lib/bootstrap/modal",
    "tooltip":"lib/bootstrap/tooltip",
    "tab": "lib/bootstrap/tab",
  },
  shim: {
    'dropdown': {
      deps: ['jquery']
    },
    'modal': {
      deps: ['jquery']
    },
    'modal':{
      deps: ['jquery']
    },
    'bootpag': {
      deps: ['jquery']
    },
    'dmuploader':{
      deps:['jquery']
    },
    'tab':{
      deps:['jquery']
    },
    'messenger':{
      exports:"Messenger"
    }
  }
});
// 使用组件
var orderModule = [
  'dropdown',
  'modal',
  'tab',
  'productList',
  'productActive',
  'productAddActive',
  'productInfo',
  'productUpdate'
];
// 使用
require(orderModule, function() {

});
