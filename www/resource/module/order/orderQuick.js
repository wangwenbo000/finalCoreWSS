define(['jquery'],function($){
  $('.selectgroup').on('click',function(){
      $('.selectgroup').attr('class','btn btn-default selectgroup');
      $(this).attr('class','btn btn-primary selectgroup');
  });
})
