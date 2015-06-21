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
var formfliter = new Vue({
    el: '#formfliter',
    data: {
        searchC:'*',
        sex:'*',
        isSubscribe:'*',
        province:'0',
        city:'0',
        logic:'AND'
    },
    methods: {
        onClick: function (e) {
            this.city='0';
        }
    },
    computed: {
        outPutFilterJson:function(){
            var json={};
            if(this.searchC!='*'){
                switch (this.searchC){
                    case 'username':
                        var searchVArr = [];
                        searchVArr[0]='like';
                        searchVArr[1]='%'+this.searchV+'%';
                        json[this.searchC] = searchVArr;
                        break;
                    default :
                        json[this.searchC]=this.searchV;
                        break
                }
            }
            if(this.sex!='*'){
                json['sex'] = this.sex;
            }
            if(this.isSubscribe!='*'){
                json['isSubscribe'] = this.isSubscribe;
            }
            if(this.logic!='AND'){
                json['_logic']=this.logic;
            }
            if(this.province!='0'){
                var locationArr = [];
                locationArr[0]='like';
                locationArr[1]='%'+this.province.substr(0, 2)+'%';
                json['location']=locationArr;
                if(this.city!=0){
                    var cityArr=[];
                    cityArr[0]='like';
                    cityArr[1]='%'+this.city.substr(0,2)+','+this.province.substr(0, 2)+'%';
                    json['location']=cityArr;
                }
            }
            return json;
        }
        }
});
//获取用户地址列表
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
$('.selectgroup').on('click',function(){
    $('.selectgroup').attr('class','btn btn-default selectgroup');
    $(this).attr('class','btn btn-primary selectgroup');
});
//筛选
$('#searchUsers').on('click',function(){
    var filterJsonStr = JSON.stringify(formfliter.outPutFilterJson);
    console.log(filterJsonStr);
    Messenger().run({
        successMessage: '成功返回请求数据',
        errorMessage: 'Error saving data',
        progressMessage: '正在请求用户数据...'
    },{
        url: '/Admin/user/getfliterusersdatalist',
        type:'post',
        data:{'data':filterJsonStr},
        success:function(data){
            console.log(data);
            userList.$data.userlist = JSON.parse(data);
        }
    });
});