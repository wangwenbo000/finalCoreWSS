var productList = new Vue({
        el:'#productlist',
        data:{products:dataJSON}
});
var uploadProductInfo = new Vue({
        el:'#updateFoodInfo',
        data:{name:'hi'}
});

$('#addActiveProduct').on('click',function(){
    $('#exampleModal').modal('show');
    $('#editTab a:last').tab('show');
});

$('#productModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var productId = button.data('id');
    var whichDay = button.data('day');
    $(this).find('.modal-title').text('更新\"'+whichDay+'\"的早餐');

    Messenger().run({
        successMessage: '正在请求 ['+whichDay+'] 早餐数据',
        errorMessage: 'Error saving data',
        progressMessage: '正在处理数据',
    },{
        url: '/Admin/Product/getinfobyid',
        type:'post',
        data:{'id':productId},
        success:function(data){
            uploadProductInfo.$data = JSON.parse(data)[0];
            Messenger().post('数据请求完成');
        }
    });
});