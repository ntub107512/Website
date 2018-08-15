/*input tags*/
$(document).ready( function() {
  $("#tag-typer").keypress( function(event) {
    var key = event.which;
    if (key == 13 || key == 44){
     event.preventDefault();
     var tag = $(this).val();
      if(tag.length > 0){
        $("<span class='tag' style='display:none'><span class='close'>&times;</span>"+tag+" </span>").insertBefore(this).fadeIn(100);
        $(this).val("");
      }
    }
  });
  
  $("#tags").on("click", ".close", function() {
    $(this).parent("span").fadeOut(100);
  });
  
  $(".colors li").click(function() {
    var c = $(this).css("background-color");
    $(".tag").css("background-color",c);
    $("#title").css("color",c);
  });
  
});