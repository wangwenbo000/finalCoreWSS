define(['vue', 'jquery'], function(Vue, $) {
  var formInfo = new Vue({
    el: '#formInfo',
    data: {
      name: '',
      idcard: '',
      phonenum: '',
      address: '',
      power: '0',
      state: '1'
    },
    methods: {
      addExpress: function() {
        var reg_id = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        var reg_phone = /^1\d{10}$/;

        for (var k in this.$data) {
          if (this.$data[k] === "") {
            console.log(k);
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
        if (reg_id.test(this.$data.idcard) == false) {
          alert('身份证格式不合法，请检查');
          return false;
        }
        if (!reg_phone.test(this.$data.phonenum)) {
          alert('手机号码格式不正确');
          return false;
        }
        $.ajax({
          url: '/Admin/Express/addnewexpress',
          type: 'POST',
          data: {
            data: JSON.stringify(formInfo.$data)
          },
          success: function(data) {
            $('#formInfo').modal('hide');
            expressJSON.data.unshift(formInfo.$data);
          }
        });
      }
    }
  });

  $('#formInfo').on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget);
    var getEditId = button.data('id');
    var getAction = button.data('action');
    if (getAction == "edit") {
      $.ajax({
        url: '/Admin/Express/editexpress',
        type: 'POST',
        data: {
          id: getEditId
        },
        success: function(data) {
          formInfo.$data = data.data.info[0];
        }
      });
    } else {
      formInfo.$data = {
        name: '',
        idcard: '',
        phonenum: '',
        address: '',
        power: 0,
        state: 1
      }
    }
  });
});
