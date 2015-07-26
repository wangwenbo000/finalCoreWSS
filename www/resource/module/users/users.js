// 用户组件基本配置
require.config({　　　　
  baseUrl: "/resource/module/",
  　paths: {
    // lib
    "jquery": "lib/jquery-1.11.3.min",
    "vue": "lib/vue.min",
    "bootpag": "lib/jquery.bootpag.min",
    // "cxselect": "lib/jquery.cxselect.min",
    // users
    "userlist": "users/userlist",
    "userAddress": "users/userAddress",
    "userFilter": "users/userFilter",
    "userPage": "users/userPage",
    // bootstrap
    "dropdown": "lib/bootstrap/dropdown",
    "modal": "lib/bootstrap/modal"　　
  },
  shim: {
    'dropdown': {
      deps: ['jquery']
    },
    'modal': {
      deps: ['jquery']
    },
    'bootpag': {
      deps: ['jquery']
    },
  }
});
// 使用组件
var userModule = [
  "jquery",
  'dropdown',
  'modal',
  "userlist",
  "userFilter",
  "userAddress",
  "userPage",
];
// 使用
require(userModule, function() {

});
