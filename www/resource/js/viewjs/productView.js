var productList = new Vue({
    el:'#productlist',
    data:{products:dataJSONdays},
    filters: {
        //自定义的filters
    },
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
    $(this).find('.modal-title').text('更新\"'+whichDay+'\"的早餐');

    Messenger().run({
        successMessage: '['+whichDay+'] 早餐数据请求成功',
        errorMessage: 'Error saving data',
        progressMessage: '正在请求 ['+whichDay+'] 早餐数据',
    },{
        url: '/Admin/Product/getinfobyid',
        type:'post',
        data:{'id':productId},
        success:function(data){
            uploadProductInfo.$data = JSON.parse(data)[0];
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

//自写上传后期维护完善
$.dragUpload = function(dom){
    $(document).on({
        dragleave:function(e){    //拖离
            e.preventDefault();
        },
        drop:function(e){  //拖后放
            e.preventDefault();
            var fileList = e.originalEvent.dataTransfer.files;

        },
        dragenter:function(e){    //拖进
            e.preventDefault();
        },
        dragover:function(e){    //拖来拖去
            e.preventDefault();
        }
    });
};
$.dragUpload('.uploadDragDiv');


