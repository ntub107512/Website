$(function() {
	$( "#buttonForEle" ).click(function() {
	  $( "#buttonForEle" ).addClass( "onclic", 250, validate);
	});
  
	function validate() {
	  setTimeout(function() {
		$( "#buttonForEle" ).removeClass( "onclic" );
		$( "#buttonForEle" ).addClass( "validate", 450, callback );
	  }, 2250 );
	}
	  function callback() {
		setTimeout(function() {
		  $( "#buttonForEle" ).removeClass( "validate" );
		}, 1250 );
	  }
});
