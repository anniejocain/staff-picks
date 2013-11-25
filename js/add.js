var source   = $('#results-template').html();
var template = Handlebars.compile(source);


$( "#search-form" ).submit(function( event ) {
	
	// get search term from input
	// send it to cloud. get results. populate column with results.
	var q = $( "input:first" ).val();
	var url = 'http://librarycloud.harvard.edu/v1/api/item/?filter=keyword:' + q + '&limit=5';
	
    $.ajax({
        url: url,
        dataType: 'jsonp',
        success: function(data){	
		   $('#results').html(template({results: data['docs']}));
		   $( ".result-item" ).draggable({ revert: "invalid" });
		   $( ".cover-image" ).each(function( item ) {
		            var image = $(this);
		    var isbn = $(this).data('isbn');
                $.ajax({
                   url: 'amazon.php?query=' + isbn,
                   dataType: 'json',
                   success: function(data){	console.log(data[0])
                         image.attr('src', data[0].thumbnail);
                   }
            });
        });
       }
   });

	event.preventDefault();
});

 $( "#drop-box" ).droppable({
    drop: function( event, ui ) {
        $('.result-item').draggable('disable');
        $( this )
        .addClass( "ui-state-highlight" ).addClass('full');
        console.log('dropped');
    }
});

function ISBN13toISBN10(isbn13) {
 
    var start = isbn13.substring(3, 12);
    var sum = 0;
    var mul = 10;
    var i;
     
    for(i = 0; i < 9; i++) {
        sum = sum + (mul * parseInt(start[i]));
        mul -= 1;
    }
     
    var checkDig = 11 - (sum % 11);
    if (checkDig == 10) {
        checkDig = "X";
    } else if (checkDig == 11) {
        checkDig = "0";
    }
     
    return start + checkDig;
}