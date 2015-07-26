define(['vue','jquery','dmuploader'],function(Vue,$,dmuploader){
  var updateProductInfo = new Vue({
      el:'#updateFoodInfo',
      data:{
        productName:'',cost:'',price:'',repertory:'',describe:''
      }
  });

  $('#productModal').on('show.bs.modal', function (event) {
      $('#editTab a:first').tab('show');
      var button = $(event.relatedTarget);
      var productId = button.data('id');
      var whichDay = button.data('day');
      $(this).find('.modal-title').text('更新星期\"'+whichDay+'\"的早餐');

      $.ajax({
          url: '/Admin/Product/getinfobyid',
          type:'post',
          data:{'id':productId},
          success:function(data){
            updateProductInfo.$data = JSON.parse(data)[0];
          }
      });
      //拖拽上传
      $('#dragUpload').dmUploader({
          url:'/Admin/Product/upload',
          method:'POST',
          allowedTypes:'image/jpeg',
          onInit: function(){
              console.log('上传插件加载成功');
          },
          extraData: {
              name:whichDay
          },
          onNewFile: function(id, file){
              if (typeof FileReader !== "undefined"){

                  var reader = new FileReader();
                  var img = $('.uploadimgag');
                  reader.onload = function (e) {
                      img.attr('src', e.target.result);
                  };
                  reader.readAsDataURL(file);
              } else {
                  console('浏览器版本太低');
              }
          },
          onUploadProgress: function(id, percent){
              $('.progress-bar').css('width',percent+'%');
          },
          onUploadSuccess: function(id, data){
              console.log(data);
          }
      });
  });

  $('button[name=uploadProductInfo]').on('click',function(){
      var updateJSONStr = $('input[name=updatejson]').attr('value');
      var updateJSON = JSON.parse(updateJSONStr);
      Messenger().run({
          successMessage: '数据添加成功',
          errorMessage: 'Error saving data',
          progressMessage: '正在更新数据',
      },{
          url: '/Admin/Product/updateinfobyid',
          type:'post',
          data:{'id':updateJSON.id,'json':updateJSONStr},
          success:function(data){
              $('#productModal').modal('hide');
          }
      });
  });

  return{
    infoData:updateProductInfo.$data
  }
});
