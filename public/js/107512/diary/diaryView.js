$('.gallery-item').hover(function(){
  $(this).find('h5, p').stop().animate({
      opacity: '1',              
      marginLeft: '230px'
  }, 300);
}, function(){
  $(this).find('h5, p').stop().animate({
      opacity: '0',              
      marginLeft: '0px'
  }, 100);
});

/* AUTHOR LINK */
$('.about-me-img img, .authorWindowWrapper').hover(function(){
  $('.authorWindowWrapper').stop().fadeIn('fast').find('p').addClass('trans');
}, function(){
});
