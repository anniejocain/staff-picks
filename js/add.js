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