module.exports = Model(function(){
    return {
        //获取用户列表
        getList: function(getPage){
            var getPage = getPage;
            return D('Users').order('id DESC').page(getPage, 20).countSelect().then(function(data){
                console.log(data);
                return data;
            })
        }
    }
})