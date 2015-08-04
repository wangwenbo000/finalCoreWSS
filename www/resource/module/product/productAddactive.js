define(['vue','jquery'],function(Vue,$){
  var addProductInfo = new Vue({
      el:'#addFoodInfo',
      data:{isactive:'1'}
  });

  $('#addActiveProduct').on('click',function(){
      $('#productModal').modal('show');
      $('#editTab a:last').tab('show');
  });

  $('button[name=addProductInfo]').on('click',function(){
      var addJSONStr = $('input[name=addjson]').attr('value');
      var addJSON = JSON.parse(addJSONStr);

      // Messenger().run({
      //     successMessage: '数据添加成功',
      //     errorMessage: 'Error saving data',
      //     progressMessage: '正在更新数据',
      // },{
      $.ajax({
          url: '/Admin/Product/addNewDataForActive',
          type:'post',
          data:{'json':addJSONStr},
          success:function(data){
              $('#productModal').modal('hide');
          }
      });
  });
});
