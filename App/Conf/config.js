module.exports = {
  //配置项: 配置值
  port: 1288, //监听的端口
  db_type: 'mysql', // 数据库类型
  db_host: 'localhost', // 服务器地址
  db_port: '3307', // 端口
  db_name: 'wechat_shopping', // 数据库名
  db_user: 'root', // 用户名
  db_pwd: '15117909848', // 密码
  db_prefix: 'king_', // 数据库表前缀

  'app_group_list': ['Home', 'Admin'],

  'default_group': 'Home', //默认分组
  'default_controller': 'Index', //默认控制器
  'default_action': 'index',  //默认操作

    //操作默认后缀
  'action_suffix': 'Action',
  'call_method': '__call',
  call_controller: "Home:Index:_404"
};