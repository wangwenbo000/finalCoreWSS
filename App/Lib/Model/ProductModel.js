module.exports = Model(function(){
    return {
        //获取用户列表
        getProduct: function(getPage){
            return D('Products').order('id DESC').select().then(function(data){
                console.log(data);
                return data;
            });
        }
    }
})