var expresslist = new Vue({
    el:'#expresslist',
    data:{
      express:expressJSON.data
    }
});
var delExpressById = new Vue({
    el:'#delExpress',
    data:{
      id:''
    },
    methods:{
      delExpress:function(){
        $.ajax({
          url:'/Admin/Express/delexpress',
          type:'POST',
          data:{id:delExpressById.$data.id},
          success:function(data){
            $('#delExpress').modal('hide');
          }
        });
      }
    }
});
var formInfo = new Vue({
    el:'#formInfo',
    data:{
      name:'',
      idcard:'',
      phonenum:'',
      address:'',
    },
    methods:{
      addExpress:function(){
        for(var k in this.$data){
          if(this.$data[k]==""){
            switch (k) {
              case "name":
                alert('名字为必填');
              break;
              case "idcard":
                alert('身份证为必填');
              break;
              case "phonenum":
                alert('手机号为必填');
              break;
              case "address":
                alert('地址为必填');
              break;
            }
            return false;
          }
        };
        $.ajax({
          url:'/Admin/Express/addnewexpress',
          type:'POST',
          data:{data:JSON.stringify(formInfo.$data)},
          success:function(data){
            $('#formInfo').modal('hide');
            expressJSON.data.unshift(formInfo.$data);
          }
        });
      }
    }
});
$('#formInfo').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var getEditId = button.data('id');
  var getAction = button.data('action');
  if(getAction == "edit"){
    $.ajax({
      url:'/Admin/Express/editexpress',
      type:'POST',
      data:{id:getEditId},
      success:function(data){
        formInfo.$data = data.data.info[0];
      }
    });
  }else {
    formInfo.$data = {name:'',idcard:'',phonenum:'',address:''}
  }
});
$('#delExpress').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var getEditId = button.data('id');
  delExpressById.$data.id = getEditId;
});

// 生成配送员随机码
function createStr(){
  return Math.random().toString(36).substr(2, 16);
}
