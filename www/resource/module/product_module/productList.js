  var productList = new Vue({
    el: '#productlist',
    data: {
      products: dataJSONdays,
      actives: dataJSONactive,
      forms: {},
      aforms: {},
      index: null
    },
    filters: {
      weekInZH:function(val){
        var weekWord = ['天','壹','貳','叁','肆','伍','陆'];
        return weekWord[val];
      }
    },
    methods: {
      editInfo: function(info, index) {
        $('#editTab a:first').tab('show');
        var self = this;
        this.forms = info;
        this.index = index;

        // 上传
        var uploadCofig = {
          uploadUrl: "/Admin/Product/upload",
          uploadAsync: true,
          maxFileCount: 1,
          uploadExtraData:{id: info.id},
          allowedFileExtensions: ["jpg", "png", "gif"],
          maxFileSize:30,
          initialPreview: [
            "<img src='/resource/img/food/"+info.foodimg+"' class='file-preview-image'>",
          ]
        }
        $('#productimg').fileinput('refresh',uploadCofig);

        $("#productimg").fileinput(uploadCofig).on('fileuploaded',function(event,data){
          self.forms.foodimg = data.response.filename;
        });
      },
      addAdtive: function() {
        $('#productModal').modal('show');
        $('#editTab a:last').tab('show');
        this.aforms.isactive = 1;
      },
      editBtn: function() {
        var data = JSON.stringify(this.forms);
        var self = this;
        $.ajax({
          url: '/Admin/Product/updateinfobyid',
          type: 'post',
          data: {
            'id': this.forms.id,
            'json': data
          },
          success: function(data) {
            self.products.$set(self.index, self.forms);
            $('#productModal').modal('hide');
          }
        });
      },
      addBtn: function() {
        var data = JSON.stringify(this.aforms);
        var self = this;
        $.ajax({
          url: '/Admin/Product/addNewDataForActive',
          type: 'post',
          data: {
            'json': data
          },
          success: function(data) {
            self.actives.unshift(this.aforms);
            $('#productModal').modal('hide');
          }
        });
      },
      editActiveBtn: function() {

      }
    }
  });
