module.exports = Model(function(){
    return {
        //获取用户列表
        getList: function(getPage){
            return D('Users').order('id DESC').page(getPage, 20).countSelect().then(function(data){
                return data;
            })
        },
        getUserAddressList:function(id){
            return D('addresslist').where({'userid':id}).countSelect().then(function(data){
                return {"data":data.data,"count":data.count};
            })
        }
    }
})