var orderList = new Vue({
    el:'#orderlist',
    data:{order:showListJson}
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
            url: '/Admin/Order/fliter',
            type:'post',
            data:{'fliterjson':JSON.stringify(getFliterJson)},
            success:function(data){
                orderList.$data.order = JSON.parse(data);
                $btnstatic.button('reset');
            }
        });

    })

})
$.cxSelect.defaults.url = '/resource/js/sendAddress.json';

$('#chinaSel').cxSelect({
    selects: ['province', 'city', 'area']
});