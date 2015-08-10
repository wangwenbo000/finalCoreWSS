  var userList = new Vue({
      el:"#userList",
      data:{
        userlist:userJSON
      },
      methods:{
        getAddress:function(id){
          var self = this;
          $.ajax({
              url: '/Admin/user/getuseraddresslist',
              type:'post',
              data:{'id':id},
              success:function(data){
                  self.addressList = JSON.parse(data).data;
                  self.addressListCount = JSON.parse(data).count;
              }
          });
        }
      }
  });

  // 绑定翻页初始化
  function pageAjax(json){
      $.ajax({
          url: '/Admin/User/getfliterusersdatalist',
          type:'post',
          data:json,
          success:function(data){
              userList.userlist = JSON.parse(data).data;
          }
      })
  }
  function bindPager(json,total){
      $('.page-selection-top, .page-selection-bottom').bootpag({
          total:total,
          page: 1,
          maxVisible: 30,
      }).on("page",function(event,num){
          pageAjax({pagenum:num,fliterjson:json});
      });
  }
  bindPager('{}',total);
