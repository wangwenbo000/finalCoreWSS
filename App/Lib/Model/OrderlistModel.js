module.exports = Model(function(){
    return {
        //获取用户列表w
        getUserOrderList: function(id){
            return D('Order').where({userid:id,nowstate:['>',0]}).order('id DESC').countSelect().then(function(data){
                return data;
            })
        }
    }
})