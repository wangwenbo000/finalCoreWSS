module.exports = Model(function(){
    return {
        //获取用户列表
        getProduct: function(getPage){
            return D('Products').order('id DESC').select().then(function(data){
                return data;
            });
        },
        selectById:function(id){
            return D('Products').where({'id':id}).select().then(function(data){
                return data;
            });
        }
    }
})