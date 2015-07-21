var expresslist = new Vue({
    el:'#expresslist',
    data:{
      express:expressJSON.data
    },
    filters:{
      state2show:function(value){
        switch (value) {
          case 1:
          return "在职";
            break;
          case 0:
          return "离职";
            break;
        }
      },
      power2show:function(value){
        switch (value) {
          case 1:
          return "组长";
            break;
          case 0:
          return "职员";
            break;
        }
      },
    }
});
var expressRecord = new Vue({
    el:'#expressOrder',
    data:{record:[],count:''},
    filters:{

      },
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
      power:0,
      state:1
    },
    methods:{
      addExpress:function(){
        var reg_id = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        var reg_phone = /^1\d{10}$/;
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
          if (reg_id.test(this.$data[k].idcard)===false) {
            alert('身份证格式不合法，请检查');
            return false;
          }
          if(!reg_phone.test(this.$data[k].idcard)){
            alert('手机号码格式不正确');
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
    formInfo.$data = {name:'',idcard:'',phonenum:'',address:'',power:0,state:1}
  }
});
$('#delExpress').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var getEditId = button.data('id');
  delExpressById.$data.id = getEditId;
});
$('#expressOrder').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var getExpresserId = button.data('id');
  $.ajax({
    url:'/Admin/Express/getExpressRecord',
    type:'POST',
    data:{id:getExpresserId},
    success:function(data){
      expressRecord.$data.record = JSON.parse(data).data;
      expressRecord.$data.count = JSON.parse(data).count;
      console.log(JSON.parse(data).count);
    }
  })
});

// 生成配送员随机码
function createStr(){
  return Math.random().toString(36).substr(2, 16);
}
