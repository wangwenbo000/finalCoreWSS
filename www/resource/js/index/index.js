/**
 * Created by wangwenbo on 15/7/7.
 */
define(function(require, exports, module){
    var $ = require('/resource/js/jquery');
    var vue = require('/resource/js/vue.min');
    require('/resource/js/modal')($);

exports.initPage = function() {
    var sendOrder = new Vue({
        el:'#indexPostOrder',
        data:{
            expressTime:0,
            receiveWay:0,
            everyDayNum:1,
            addresslist:addresslistJson,
            calendar:calendarArr,
            suggest:'',
            updateForm:{
                userid:'<%- userid%>',
                receiveuser:'',
                address:'',
                addressKey:'',
                phonenum:''
            },
            suggess:[],
            chooseaddressId:''
        },
        methods:{
            getdata:function(e){
                console.log(e.target.innerHTML);
            },
            everyDayNumBtn:function(action){
                action=='a'?this.$data.everyDayNum--:this.$data.everyDayNum++;
                if(this.$data.everyDayNum<1) this.$data.everyDayNum=1;
            },
            update:function(){
                var updateInfo = JSON.stringify(this.$data.updateForm);
                $.ajax({
                    url:'Home/Index/update',
                    type:'POST',
                    data:{info:updateInfo},
                    success:function(data){
                        $('#addressForm').modal('hide');
                    }
                })
            },
            chooseAddress:function(p){
                this.$data.chooseaddressId = p.id;
                $('#chooseAddress').modal('hide');
                console.log(p.address);
                $('#chooseAddressBtn').html("<i class='glyphicon glyphicon-map-marker'></i> "+p.address).attr('class','btn btn-success btn-block btn-lg');
            },
            getsuggest:function(){
                var tableid = '5588fe0be4b062df8bcd62da';
                var city = '北京市';
                var keywords = this.$data.suggest;
                var filter = ' ';
                var limit = 10;
                var page = 1;
                var key = '4af78342937c8140440f75c9809063c5';
                var that = this;

                $.ajax({
                    type: "get",
                    url: "http://yuntuapi.amap.com/datasearch/local?tableid="+tableid+"&city="+city+"&keywords="+keywords+"&key="+key,
                    dataType: "jsonp",
                    jsonp: "callback",
                    jsonpCallback:"jsonpCallback",
                    success: function(json){
                        var arr=[];
                        arr.push(json);
                        that.$data.suggess = arr[0].datas;
                    },
                    error: function(){
                        console.log('fail');
                    }
                });
            },
            addsuggess:function(suggess){
                $('#searchAddress').modal('hide');
                this.$data.updateForm['addressKey']=suggess.su._name;
                this.$data.updateForm['address']=suggess.su._address;
                console.log(suggess.su);
            },
            chooseDay:function(p){
                if(p.done){
                    p.choose='success';
                }else{
                    p.choose='';
                }
                p.done = !p.done;

            }
        }
    });

    $('#addressForm').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        if(button.data('id')!=undefined){
            $.ajax({
                url:'Home/Index/select',
                type:'POST',
                data:{id:button.data('id')},
                success:function(data){
                    sendOrder.$data.updateForm = JSON.parse(data)[0];
                }
            });
        }else{
            sendOrder.$data.updateForm = {
                userid:'<%- userid%>',
                receiveuser:'',
                address:'',
                addressKey:'',
                phonenum:''
            }
        }

    });
}
});

