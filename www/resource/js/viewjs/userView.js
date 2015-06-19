$("[name='searchBlur']").bootstrapSwitch();
$.cxSelect.defaults.url = '/resource/js/cityData.min.json';

$('#chinaSel').cxSelect({
    selects: ['province', 'city', 'area']
});
var userList = new Vue({
    el:"#userList",
    data:{userlist:userJSON}
});
var getAddressList = new Vue({
    el:"#address",
    data:{
        addressListCount:'',
        addressList:''
    }
});
//获取订单列表
$('#usermodal').on('show.bs.modal', function (event) {

    var button = $(event.relatedTarget);
    var userId = button.data('id');
    $(this).find('.modal-title').text('查看早餐详情 ID：'+userId);
    //加载单比订单
    Messenger().run({
        successMessage: '用户地址列表请求成功',
        errorMessage: 'Error saving data',
        progressMessage: '正在请求用户地址数据...'
    },{
        url: '/Admin/user/getuseraddresslist',
        type:'post',
        data:{'id':userId},
        success:function(data){
            getAddressList.$data.addressList = JSON.parse(data).data;
            getAddressList.$data.addressListCount = JSON.parse(data).count;
        }
    });
});