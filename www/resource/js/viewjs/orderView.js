var orderList = new Vue({
    el:'#orderlist',
    data:{order:listJSON}
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
        iscallmeup:'*',
        logic:'AND'
    },
    computed: {
        outPutFilterJson:function(){
            var json={};
            if(this.searchC!='*'){
                json[this.searchC]=this.searchV;
            }
            if(this.productstatic!='*'){
                json['productstatic'] = this.productstatic;
            }
            if(this.expresstime!='*'){
                json['expresstime'] = this.expresstime;
            }
            if(this.logic!='AND'){
                json['_logic']=this.logic;
            }
            if(this.iscallmeup!='*'){
                json['iscallmeup']=this.iscallmeup;
            }
            if($('#flitertime').attr('value')!=''){
                json['time'] = $('#flitertime').attr('value');
            }
            return json;
        }
    }
});
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
function pageAjax(json){
    $.ajax({
        url: '/Admin/Order/filter',
        type:'post',
        data:json,
        success:function(data){
            orderList.$data.order = JSON.parse(data).data;
        }
    })
}
function bindPager(top,bottom,json,total){
    $(top).bootpag({
        total:total
    }).on("page",function(event,num){
        pageAjax({pagenum:num,fliterjson:json});
        $(bottom).bootpag({
            total:total,
            page:num
        });
    });
}
//初次加载绑定头部底部翻页
bindPager('.page-selection-top','.page-selection-bottom','{}',total);
bindPager('.page-selection-bottom','.page-selection-top','{}',total);


//点击按钮筛选
$('button[class~=fliterBtn]').on('click',function(){
    var $btnstatic = $(this).button('loading');
    var getFliterJson=JSON.stringify(formfliter.outPutFilterJson);
    console.log(getFliterJson);
    Messenger().run({
        successMessage: '数据请求成功.',
        errorMessage: 'Error saving data',
        progressMessage: '正在处理数据',
    },{
        url: '/Admin/Order/filter',
        type:'post',
        data:{'fliterjson':getFliterJson},
        success:function(data){
            orderList.$data.order = JSON.parse(data).data;
            $btnstatic.button('reset');
            var str2json = JSON.parse(data);
            //绑定翻页
            bindPager('.page-selection-top','.page-selection-bottom',filterJsonStr,str2json.total);
            bindPager('.page-selection-bottom','.page-selection-top',filterJsonStr,str2json.total);
        }
    });
});
//模态打开时的操作
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

