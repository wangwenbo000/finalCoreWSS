({
  appDir:'./',
    baseUrl: './users',
    dir:'./app-build',

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
    "userQuick": "users/userQuick",
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
})
