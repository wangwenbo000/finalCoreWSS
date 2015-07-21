module.exports = Model(function(){
    var Q = require('q');
    return {
        //获取用户列表w
        getExpressList : Q.async(function* (){
          var allExpress = yield D('Express').order('id DESC').page(1, 20).countSelect();
          formatTime(allExpress.data,'YYYY-MM-DD','time');
          formatTime(allExpress.data,'YYYY-MM-DD','birth');
          return allExpress;
        }),
        addExpress:Q.async(function* (getData){
          var moment = require('moment');
          if(isEmpty(getData.id)){
            getData.sex = getSexFromId(getData.idcard);
            getData.age = getAgeFromId(getData.idcard);
            getData.birth = getBorthFromId(getData.idcard);
            getData.time = moment().format('YYYY-MM-DD');
            getData.eid = WX_createNonceStr();
            var addAndGetNewId = yield D('Express').add(getData);
          }else{
            // getData.birth = moment(getData.birth).format('YYYY-MM-DD');
            // getData.time = moment(getData.time).format('YYYY-MM-DD');
            var addAndGetNewId = yield D('Express').update(getData);
          }

          return addAndGetNewId;
        }),
        getExpressInfo:Q.async(function* (getId){
          var getInfo = yield D('Express').where({id:getId}).field(['id','name','idcard','phonenum','address','state','power']).select();
          return getInfo;
        })
    }
})
