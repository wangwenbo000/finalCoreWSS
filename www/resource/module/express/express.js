// 配送组件基本配置
require.config({　　　　
  baseUrl: "/resource/module/",
  　paths: {
    // lib
    "jquery": "lib/jquery-1.11.3.min",
    "vue": "lib/vue.min",
    "bootpag":"lib/jquery.bootpag.min",
    // express
    "expresslist": "express/expresslist",
    "expressdel": "express/expressdel",
    "expressForm": "express/expressForm",
    "expressRecord": "express/expressRecord",
    "expressPage": "express/expressPage",
    "expressRecordpage":"express/expressRecordpage",
      // bootstrap
    "dropdown": "lib/bootstrap/dropdown",
    "modal": "lib/bootstrap/modal"　　　　
  },
  shim: {
    'dropdown': {
      deps: ['jquery'],
    },
    'modal': {
      deps: ['jquery'],
    },
    'bootpag': {
      deps: ['jquery'],
      exports: 'bootpag'
    }
  }
});
// 使用组件
var expressModule = [
  'dropdown',
  'modal',
  "expresslist",
  "expressdel",
  "expressForm",
  "expressRecord",
  "expressPage",
  "expressRecordpage"
];
// 使用
require(expressModule, function() {

});
