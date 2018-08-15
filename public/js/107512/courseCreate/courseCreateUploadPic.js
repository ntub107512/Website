$(function () {
  
    // Viewing Uploaded Picture On Setup Admin Profile
    function livePreviewPicture(picture)
    {
      if (picture.files && picture.files[0]) {
        var picture_reader = new FileReader();
        picture_reader.onload = function(event) {
          $('#uploaded').attr('src', event.target.result);
        };
        picture_reader.readAsDataURL(picture.files[0]);
      }
    }
  
    $('.setup-picture form .picture input').on('change', function () {
      $('#uploaded').fadeIn();
      livePreviewPicture(this);
    });
  
  });