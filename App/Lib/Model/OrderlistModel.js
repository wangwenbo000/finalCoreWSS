module.exports = Model(function(){
    return {
        //获取用户列表w
        getUserOrderList: function(id){
            var json = {};
            return D('Order').where({userid:id,nowstate:['>',0]}).order('id DESC').countSelect().then(function(data){
                formatTime(data.data,'llll','ordertime');
                if(data.count==0){
                    json.progressCount='';
                }else{
                    json.progressCount=data.count;
                }
                json.progress = data.data;
            }).then(function(){
                return D('Order').where({userid:id,nowstate:-1}).order('id DESC').countSelect().then(function(data){
                    formatTime(data.data,'llll','ordertime');
                    if(data.count==0){
                        json.cancelCount='';
                    }else{
                        json.cancelCount=data.count;
                    }
                    json.cancel = data.data;
                });
            }).then(function(){
                return D('Order').where({userid:id,nowstate:0}).order('id DESC').countSelect().then(function(data){
                    formatTime(data.data,'llll','ordertime');
                    if(data.count==0){
                        json.completeCount='';
                    }else{
                        json.completeCount=data.count;
                    }
                    json.complete = data.data;
                    return json;
                });
            });
        }
    }
})