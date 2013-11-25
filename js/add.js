// Our handlebars seach results template
var source   = $('#results-template').html();
var template = Handlebars.compile(source);

// Our Library Cloud offset
var start = 0;
var num_found = 0;

var search_lc = function() {
    	// get search term from input
    	// send it to cloud. get results. populate column with results.
    	
    	var q = $( "input:first" ).val();
    	var url = 'http://librarycloud.harvard.edu/v1/api/item/?filter=keyword:' + q + '&start=' + start + '&limit=5';

        $.ajax({
           url: url,
           dataType: 'jsonp',
           success: function(data){		   
    		   $('#results').html(template({results: data['docs']}));
    		   num_found = data.num_found;
    		   $('#result_count').html(num_found.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' matches');
    		   
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
}

$( "#search-form" ).submit(function( event ) {
    start = 0;
    search_lc();
	event.preventDefault();
});

 $( "#drop-box" ).droppable({
    drop: function( event, ui ) {
        $('.result-item').draggable('disable');
        $( this )
        .addClass( "ui-state-highlight" ).addClass('full');
    }
});

$( "#search-prev" ).click(function() {
    start = start - 5;

    if (start < 0) {
        start = 0;
        search_lc();
    }
});

$( "#search-next" ).click(function() {
    if (!(start + 5 >= num_found)) {
        start = start + 5;
        search_lc();
    }
});