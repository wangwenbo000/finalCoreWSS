  var userList = new Vue({
      el:"#users",
      data:{
        userlist:userJSON,
        searchC:'*',
        sex:'*',
        isSubscribe:'*',
        province:'0',
        city:'0',
        logic:'AND',
        addressList:null,
        addressListCount:''
      },
      ready:function(){
        $('.page-selection-bottom').bootpag({
          total:total,
          page: 1,
          maxVisible: 20,
        }).on('page',function(event,num){
          var self = $(this);
          $.ajax({
            url: '/Admin/User/getfliterusersdatalist',
            type:'post',
            data:{pagenum:num,fliterjson:'{}'},
            success:function(data){
                userList.userlist = JSON.parse(data).data;
                self.bootpag({
                  total:JSON.parse(data).total,
                  page:num,
                  maxVisible:30
                });
            }
          })
        });
      },
      methods:{
        getAddress:function(id){
          console.log(id);
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

  function createPager(json,_total){
    $('.page-selection-top').bootpag({
      total:_total,
      page: 1,
      maxVisible: 20,
    }).on('page',function(event,num){
      var self = $(this);
      $.ajax({
        url: '/Admin/Order/filter',
        type:'post',
        data:{pagenum:num,fliterjson:json},
        success:function(data){
            orderList.order = JSON.parse(data).data;
            self.bootpag({
              total:JSON.parse(data).total,
              page:num,
              maxVisible:30
            });
        }
      })
    })
  }
