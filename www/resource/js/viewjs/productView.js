var productList = new Vue({
    el:'#productlist',
    data:{products:dataJSONdays}
});
var activeList = new Vue({
    el:'#activelist',
    data:{actives:dataJSONactive}
});
var uploadProductInfo = new Vue({
    el:'#updateFoodInfo',
    data:{name:'hi'}
});
var addProductInfo = new Vue({
    el:'#addFoodInfo',
    data:{isactive:'1'}
});
Vue.filter('reverse', function (value) {
    alert(value);
    return value+'a';
})

$('#addActiveProduct').on('click',function(){
    $('#productModal').modal('show');
    $('#editTab a:last').tab('show');
});
$('#productModal').on('show.bs.modal', function (event) {
    $('#editTab a:first').tab('show');
    var button = $(event.relatedTarget);
    var productId = button.data('id');
    var whichDay = button.data('day');
    $(this).find('.modal-title').text('更新星期\"'+whichDay+'\"的早餐');

    Messenger().run({
        successMessage: '星期['+whichDay+'] 早餐数据请求成功',
        errorMessage: 'Error saving data',
        progressMessage: '正在请求星期 ['+whichDay+'] 早餐数据',
    },{
        url: '/Admin/Product/getinfobyid',
        type:'post',
        data:{'id':productId},
        success:function(data){
            uploadProductInfo.$data = JSON.parse(data)[0];
        }
    });

    //拖拽上传
    $('#dragUpload').dmUploader({
        url:'/Admin/Product/upload',
        method:'POST',
        allowedTypes:'image/jpeg',
        onInit: function(){
            console.log('Plugin successfully initialized');
        },
        extraData: {
            name:whichDay
        },
        onNewFile: function(id, file){
            /* Fields availabe are:
             - file.name
             - file.type
             - file.size (in bytes)
             */
            //file.name = nowID+"."+file.type.split('/')[1];
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
            //console.log('Upload of #' + id ' is at %' + percent);
            // do something cool here!
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
        successMessage: '当前数据数据更新成功',
        errorMessage: 'Error saving data',
        progressMessage: '正在更新数据',
    },{
        url: '/Admin/Product/updateinfobyid',
        type:'post',
        data:{'id':updateJSON.id,'json':updateJSONStr},
        success:function(data){
            $('#productModal').modal('hide');
            dataJSON[parseInt(data)] = updateJSON;
            productList.$data.products = dataJSON;
        }
    });
});
$('button[name=addProductInfo]').on('click',function(){
    var addJSONStr = $('input[name=addjson]').attr('value');
    var addJSON = JSON.parse(addJSONStr);

    Messenger().run({
        successMessage: '数据添加成功',
        errorMessage: 'Error saving data',
        progressMessage: '正在更新数据',
    },{
        url: '/Admin/Product/addNewDataForActive',
        type:'post',
        data:{'json':addJSONStr},
        success:function(data){
            $('#productModal').modal('hide');
        }
    });
});




