// Our handlebars seach results template
var source   = $('#results-template').html();
var template = Handlebars.compile(source);

// Our Library Cloud offset
var start = 0;
var num_found = 0;
var q = '';

var search_lc = function() {
    	// get search term from input
    	// send it to cloud. get results. populate column with results.
    	
    	var url = 'http://librarycloud.harvard.edu/v1/api/item/?filter=keyword:' + q + '&start=' + start + '&limit=5';

        $.ajax({
           url: url,
           dataType: 'jsonp',
           success: function(data){		   
    		   $('#results').html(template({results: data['docs']}));
    		   num_found = data.num_found;
    		   $('#result_count').html(num_found.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' matches');
		       button_manager();
    		   $( ".result-item" ).draggable({ revert: "invalid" });
    		   $( ".cover-image" ).each(function( item ) {

	            var image = $(this);
    		    var isbn = $(this).data('isbn');
                $.ajax({
                   url: 'amazon.php?query=' + isbn,
                   dataType: 'json',
                   success: function(data){
                         image.attr('src', data[0].thumbnail);
                   }
                });
                });
           }
       });    
}

var button_manager = function() {
    console.log('working the buttons. start, num_found.', start, num_found);
    
    // Disable/enable prev paging button
    if (start <= 0) {
        $("#search-prev").addClass('disabled');
    } else {
        $("#search-prev").removeClass('disabled');
    }    

    // Disable/enable next paging button    
    if (start >= num_found) {
        console.log('adding disabled ot next. start, num_found.', start, num_found);
        $("#search-next").addClass('disabled');
    } else {
        $("#search-next").removeClass('disabled');
    }
}

$( "#search-form" ).submit(function( event ) {
	q = $( "input:first" ).val();
    start = 0;
    search_lc();
	event.preventDefault();
});

 $( "#drop-box" ).droppable({
    drop: function( event, ui ) {
        $('.result-item').draggable('disable');
        $( this ).addClass( "ui-state-highlight" ).addClass('full');
    }
});

$( "#search-prev" ).click(function() {
    start = start - 5;
    if (start < 0) {
        start = 0;
    }
    button_manager();
    search_lc();
});

$( "#search-next" ).click(function() {
    if (!(start + 5 >= num_found)) {
        start = start + 5;
    }
    button_manager();
    search_lc();
});

button_manager();