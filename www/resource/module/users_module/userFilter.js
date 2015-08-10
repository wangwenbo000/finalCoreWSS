define(['vue','userlist','userPage'],function(Vue,uData,bPage){
  // $('#chinaSel').cxSelect({
  //   url:'lib/cityData.min.json',
  //   selects: ['province', 'city', 'area'],
  // });

  var formfliter = new Vue({
      el: '#formfliter',
      data: {
          searchC:'*',
          sex:'*',
          isSubscribe:'*',
          province:'0',
          city:'0',
          logic:'AND'
      },
      methods: {
          onClick: function (e) {
              this.city='0';
          }
      },
      computed: {
          outPutFilterJson:function(){
              var json={};
              if(this.searchC!='*'){
                  switch (this.searchC){
                      case 'username':
                          var searchVArr = [];
                          searchVArr[0]='like';
                          searchVArr[1]='%'+this.searchV+'%';
                          json[this.searchC] = searchVArr;
                          break;
                      default :
                          json[this.searchC]=this.searchV;
                          break
                  }
              }
              if(this.sex!='*'){
                  json['sex'] = this.sex;
              }
              if(this.isSubscribe!='*'){
                  json['isSubscribe'] = this.isSubscribe;
              }
              if(this.logic!='AND'){
                  json['_logic']=this.logic;
              }
              if(this.province!='0'){
                  var locationArr = [];
                  locationArr[0]='like';
                  locationArr[1]='%'+this.province.substr(0, 2)+'%';
                  json['location']=locationArr;
                  if(this.city!=0){
                      var cityArr=[];
                      cityArr[0]='like';
                      cityArr[1]='%'+this.city.substr(0,2)+','+this.province.substr(0, 2)+'%';
                      json['location']=cityArr;
                  }
              }
              return json;
          }
          }
  });

  $('#searchUsers').on('click',function(){
      var filterJsonStr = JSON.stringify(formfliter.outPutFilterJson);
      $.ajax({
          url: '/Admin/User/getfliterusersdatalist',
          type:'post',
          data:{'fliterjson':filterJsonStr},
          success:function(data){
              var str2json = JSON.parse(data);
              uData.userListData.userlist = str2json.data;
              //绑定翻页
              console.log(data);
              bPage.bindPagerFn('.page-selection-top','.page-selection-bottom',filterJsonStr,str2json.total);
              bPage.bindPagerFn('.page-selection-bottom','.page-selection-top',filterJsonStr,str2json.total);
          }
      });
  });
});
