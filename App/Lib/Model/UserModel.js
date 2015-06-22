module.exports = Model(function(){
    function userSexFilter(data){
        for(var k in data){
            switch (data[k].sex){
                case "1":
                    data[k].sex="boy";
                    break;
                case "2":
                    data[k].sex="girl";
                    break;
                default :
                    data[k].sex="臭变态";
                    break;
            }
        }
    }
    function isSubFilter(data){
        for(var k in data){
            switch (data[k].isSubscribe){
                case 0:
                    data[k].isSubscribe="未订阅";
                    break;
                case 1:
                    data[k].isSubscribe="已订阅";
                    break;
                default :
                    data[k].isSubscribe="不知道了";
                    break;
            }
        }
    }
    return {
        //获取用户列表
        getList: function(getPage){
            return D('Users').order('id DESC').page(getPage, 20).countSelect().then(function(data){
                userSexFilter(data.data);
                isSubFilter(data.data);
                return data;
            })
        },
        getUserAddressList:function(id){
            return D('addresslist').where({'userid':id}).countSelect().then(function(data){
                return {"data":data.data,"count":data.count};
            })
        },
        getFilterList:function(data,getPage){
            return D('Users').where(data).order('id DESC').page(getPage, 20).countSelect().then(function(data){
                userSexFilter(data.data);
                isSubFilter(data.data);
                return data;
            })
        }
    }
})