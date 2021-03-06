module.exports = Model(function() {
  var Q = require('q');
  return {
    //获取用户列表w
    getExpressList: Q.async(function*(getpage) {
      var allExpress = yield D('Express').order('id DESC').page(getpage, 20).countSelect();
      formatTime(allExpress.data, 'YYYY-MM-DD', 'time');
      formatTime(allExpress.data, 'YYYY-MM-DD', 'birth');
      return allExpress;
    }),
    addExpress: Q.async(function*(getData) {
      var moment = require('moment');
      if (isEmpty(getData.id)) {
        getData.sex = getSexFromId(getData.idcard);
        getData.age = getAgeFromId(getData.idcard);
        getData.birth = getBorthFromId(getData.idcard);
        getData.time = moment().format('YYYY-MM-DD');
        getData.eid = WX_createNonceStr();
        var addAndGetNewId = yield D('Express').add(getData);
        return {action:"add"};
      } else {
        var addAndGetNewId = yield D('Express').update(getData);
        return {action:"edit"};
      }


    }),
    getExpressInfo: Q.async(function*(getId) {
      var getInfo = yield D('Express').where({
        id: getId
      }).field(['id', 'name', 'idcard', 'phonenum', 'address', 'state', 'power']).select();
      return getInfo;
    }),
    expressFilter: Q.async(function*(json,getPage){
      var filterData = yield D('Express').where(json).order('id DESC').page(getPage, 20).countSelect();
      return filterData;
    })
  }
})
