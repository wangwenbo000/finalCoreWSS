  var expresslist = new Vue({
    el: '#expresslist',
    data: {
      express: expressJSON.data,
      forms:{},
      record:[],
      count:null,
      index:null
    },
    filters: {
      state2show: function(value) {
        switch (value) {
          case 1:
            return "在职";
            break;
          case 0:
            return "离职";
            break;
        }
      },
      power2show: function(value) {
        switch (value) {
          case 1:
            return "组长";
            break;
          case 0:
            return "职员";
            break;
        }
      },
      sex:function(val){
        return val?'男':'女';
      }
    },
    methods: {
      addExpress: function() {
        var reg_id = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        var reg_phone = /^1\d{10}$/;
        var self = this;

        for (var k in this.forms) {
          if (this.forms[k] === "") {
            switch (k) {
              case "name":
                alert('名字为必填');
                break;
              case "idcard":
                alert('身份证为必填');
                break;
              case "phonenum":
                alert('手机号为必填');
                break;
              case "address":
                alert('地址为必填');
                break;
              case "power":
                alert("权级需要明确");
                break;
            }
            return false;
          }
        };
        if (reg_id.test(this.forms.idcard) == false) {
          alert('身份证格式不合法，请检查');
          return false;
        }
        if (!reg_phone.test(this.forms.phonenum)) {
          alert('手机号码格式不正确');
          return false;
        }
        $.ajax({
          url: '/Admin/Express/addnewexpress',
          type: 'POST',
          data: {
            data: JSON.stringify(this.forms)
          },
          success: function(data) {
            $('#formInfo').modal('hide');
            console.log(data);
            if(data.data.action=="edit"){
              self.express.$set(self.index,self.forms);
            }else{
              self.express.unshift(self.forms);
            }
          }
        });
      },
      chooseDel:function(id,index){
        this.delId = id;
        this.delIndex = index;
      },
      delExpress: function() {
        var self = this;
        $.ajax({
          url: '/Admin/Express/delexpress',
          type: 'POST',
          data: {
            id: this.delId
          },
          success: function(data) {
            $('#delExpress').modal('hide');
            self.express.$remove(self.delIndex);
          }
        });
      },
      expressInfo:function(info,index){
        this.forms = info;
        this.index = index;
      },
      expressRecord:function(id){
        var self = this;
        $.ajax({
          url: '/Admin/Express/getExpressRecord',
          type: 'POST',
          data: {
            id: id
          },
          success: function(data) {
            var data = JSON.parse(data)
            self.record = data.data;
            self.count = data.count;
            // 绑定翻页
            bindPager_r(id,data.total,data.page);
          }
        })
      }
    }
  });
  //配送纪录翻页
  function pageAjax_r(id,num){
      $.ajax({
          url: '/Admin/Express/getExpressRecord',
          type:'post',
          data:{id:id,page:num},
          success:function(data){
            var data = JSON.parse(data)
            expresslist.record = data.data;
            expresslist.count = data.count;
          }
      })
  }
  function bindPager_r(getExpresserId,total,num){
      $('.page-expressRecord').bootpag({
          total:total,
          page:num
      }).on("page",function(event,num){
          pageAjax_r(getExpresserId,num);
      });
  }

  // 绑定翻页初始化
  function pageAjax(json){
      $.ajax({
          url: '/Admin/express/filter',
          type:'post',
          data:json,
          success:function(data){
              expresslist.express = JSON.parse(data).data;
          }
      })
  }
  function bindPager(json,total){
      $('.page-selection-top, .page-selection-bottom').bootpag({
          total:total,
          page: 1,
          maxVisible: 30,
      }).on("page",function(event,num){
          pageAjax({pagenum:num,fliterjson:json});
      });
  }
  bindPager({},total);
