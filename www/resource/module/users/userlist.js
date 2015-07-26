define(['vue'],function(Vue){
  var userList = new Vue({
      el:"#userList",
      data:{userlist:userJSON}
  });
  return{
    userListData:userList.$data
  }

});
