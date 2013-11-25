// Our handlebars seach results template
var source   = $('#results-template').html();
var template = Handlebars.compile(source);

// Our Library Cloud variables
var start = 0;
var num_found = 0;
var q = '';

var search_lc = function() {
    // Send our queries to LibraryCloud and write the results to the screen
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
                    url: '/staff-picks/services/amazon.php?query=' + isbn,
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
    // A helper to disable/enable our paging buttons
    
    // Prev paging button
    if (start <= 0) {
        $("#search-prev").addClass('disabled');
    } else {
        $("#search-prev").removeClass('disabled');
    }    

    // Next paging button    
    if ((start + 5 >= num_found)) {
        $("#search-next").addClass('disabled');
    } else {
        $("#search-next").removeClass('disabled');
    }
}

// When the search form is submitted
$( "#search-form" ).submit(function( event ) {
	q = $( "input:first" ).val();
    start = 0;
    search_lc();
	event.preventDefault();
});

// When the previous paging button is clicked
$( "#search-prev" ).click(function() {
    start = start - 5;
    if (start < 0) {
        start = 0;
    }
    button_manager();
    search_lc();
});

// When the next paging button is clicked
$( "#search-next" ).click(function() {
    if (!(start + 5 >= num_found)) {
        start = start + 5;
    }
    button_manager();
    search_lc();
});

// When an items is dragged from the the results list to the box
$( "#drop-box" ).droppable({
    drop: function( event, ui ) {
        $('.result-item').draggable('disable');
        $( this ).addClass( "ui-state-highlight" ).addClass('full');
    }
});

// Managing the paging buttons on page load
button_manager();