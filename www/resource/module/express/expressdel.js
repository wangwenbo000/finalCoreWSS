define(['vue','jquery'], function(Vue,$) {
  var delExpressById = new Vue({
    el: '#delExpress',
    data: {
      id: ''
    },
    methods: {
      delExpress: function() {
        $.ajax({
          url: '/Admin/Express/delexpress',
          type: 'POST',
          data: {
            id: delExpressById.$data.id
          },
          success: function(data) {
            $('#delExpress').modal('hide');
          }
        });
      }
    }
  });

  $('#delExpress').on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget);
    var getEditId = button.data('id');
    delExpressById.$data.id = getEditId;
  });
})
