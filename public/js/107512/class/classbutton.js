$(function() {
	$( "#buttonview" ).click(function() {
	  $( "#buttonview" ).addClass( "onclic", 250, validate);
	});
  
	function validate() {
	  setTimeout(function() {
		$( "#buttonview" ).removeClass( "onclic" );
		$( "#buttonview" ).addClass( "validate", 450, callback );
	  }, 2250 );
	}
	  function callback() {
		setTimeout(function() {
		  $( "#buttonview" ).removeClass( "validate" );
		}, 1250 );
	  }
});

$(function() {
	$( "#buttonCreate" ).click(function() {
	  $( "#buttonCreate" ).addClass( "onclic", 250, validate);
	});
  
	function validate() {
	  setTimeout(function() {
		$( "#buttonCreate" ).removeClass( "onclic" );
		$( "#buttonCreate" ).addClass( "validate", 450, callback );
	  }, 2250 );
	}
	  function callback() {
		setTimeout(function() {
		  $( "#buttonCreate" ).removeClass( "validate" );
		}, 1250 );
	  }
});


