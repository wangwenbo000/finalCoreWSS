define(['vue', 'affix'], function(Vue) {
  var expressAllocation = new Vue({
    el: '#expressAllocation',
    data: {
      selected: '',
      expressData: express
    },
    methods: {
      allocation: function() {
        var checkOrder = $('input[name=checkorder]');
        var updateOrderIdArr = [];
        checkOrder.each(function() {
          if ($(this).prop('checked') == true) {
            updateOrderIdArr.push(parseInt($(this).prop('value')));
          }
        });

        $.ajax({
          url: '/Admin/Order/allocation',
          type: 'POST',
          data: {
            updateId: JSON.stringify(updateOrderIdArr),
            data: expressAllocation.$data.selected
          },
          success: function(data) {
            $('#allocationSuccess').modal('show');
          }
        });
      }
    }
  });
})
