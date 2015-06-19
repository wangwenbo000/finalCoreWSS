module.exports = Model(function(){
    var moment = require('moment');
    function formatTime(datatime){
        for(var k in datatime){
            datatime[k].updatetime = moment(datatime[k].updatetime).lang('zh-cn').format('YYYY-MM-DD HH:mm:ss');
        }
    }
    return {
        //获取用户列表
        getProduct: function(getPage){
            var json = {};
            return D('Products').where({'isactive':'0'}).order('id DESC').select().then(function(data){
                formatTime(data);
                json.days = data;
            }).then(function(){
                return D('Products').where({'isactive':'1'}).order('id DESC').select().then(function(data){
                    formatTime(data);
                    json.active = data;
                    return json;
                })
            })
        },
        selectById:function(id){
            return D('Products').where({'id':id}).select().then(function(data){
                return data;
            });
        },
        updateById:function(id,json){
            return D('Products').where({'id':id}).update(json).then(function(affectedRows){
                return affectedRows;
            })
        },
        addData:function(json){
            return D('Products').add(json).then(function(insertId){
                return insertId;
            })
        }
    }
})