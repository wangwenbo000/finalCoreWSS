var orderList = new Vue({
    el:'#orderlist',
    data:{order:showListJson}
});
var orderSingleInfo = new Vue({
    el:'#singleorderinfo',
    data:{}
});
var attachmentInfo = new Vue({
    el:'#attachmentinfo',
    data:{}
});
var formfliter = new Vue({
    el: '#formfliter',
    data: {
        searchC:'*',
        productstatic:'*',
        expresstime:'*',
        iscallmeup:'*'
    }
});
Vue.filter('orderstatic',function(value){
    if(value==30) return '状态';
})
$('.form_date').datetimepicker({
    language:  'zh-CN',
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0
});
$('.form_time').datetimepicker({
    language:  'fr',
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 1,
    minView: 0,
    maxView: 1,
    forceParse: 0
});
$(document).ready(function(){
    var fliterJSON = {};

    $('button[class~=fliterBtn]').on('click',function(){
        var $btnstatic = $(this).button('loading');

        var getFliterJson = JSON.parse($('#fliterjson').attr('value'));
        if($('#flitertime').attr('value')!=''){
            getFliterJson.time = $('#flitertime').attr('value');
        }
        if(getFliterJson[getFliterJson.searchC] != '' || getFliterJson[getFliterJson.searchC] != '*'){
            getFliterJson[getFliterJson.searchC] = getFliterJson.searchV;
            delete getFliterJson.searchC;
            delete getFliterJson.searchV;
            delete getFliterJson['*'];
        }
        $.each(getFliterJson,function(index,item){
            if(item=='*') delete getFliterJson[index];
        });
        console.log(getFliterJson);
        Messenger().run({
            successMessage: '数据请求成功.',
            errorMessage: 'Error saving data',
            progressMessage: '正在处理数据',
        },{
            url: '/Admin/Order/filter',
            type:'post',
            data:{'fliterjson':JSON.stringify(getFliterJson)},
            success:function(data){
                orderList.$data.order = JSON.parse(data);
                $btnstatic.button('reset');
            }
        });

    });
});
$('#orderModel').on('show.bs.modal', function (event) {
    var nowbotton = event.relatedTarget.className;
    if(nowbotton=='orderAttachment'){
        $('#orderTab li:eq(1) a').tab('show');
    }else if(nowbotton=='orderInfo'){
        $('#orderTab a:first').tab('show');
    }
    var button = $(event.relatedTarget);
    var orderId = button.data('id');
    var ordernum = button.data('orderid');
    var orderAttachmentId = button.data('select');
    $(this).find('.modal-title').text('查看早餐详情 ID：'+orderId);
    //加载单比订单
    Messenger().run({
        successMessage: '早餐数据请求成功，订单号:'+ordernum,
        errorMessage: 'Error saving data',
        progressMessage: '正在请求早餐数据...',
    },{
        url: '/Admin/order/getsingleorderinfo',
        type:'post',
        data:{'id':orderId},
        success:function(data){
            orderSingleInfo.$data = JSON.parse(data)[0];
        }
    });
    //加载依附关系订单
    Messenger().run({
        successMessage: '依附关系加载，订单号:'+ordernum,
        errorMessage: 'Error saving data',
        progressMessage: '正在请求早餐数据...'
    },{
        url: '/Admin/order/getattachmentinfo',
        type:'post',
        data:{'id':orderAttachmentId,'pointid':orderId},
        success:function(data){
            attachmentInfo.$data = JSON.parse(data);
        }
    });
});
$.cxSelect.defaults.url = '/resource/js/sendAddress.json';

$('#chinaSel').cxSelect({
    selects: ['province', 'city', 'area']
});
$('.selectgroup').on('click',function(){
    $('.selectgroup').attr('class','btn btn-default selectgroup');
    $(this).attr('class','btn btn-primary selectgroup');
});