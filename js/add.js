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
       }
   });

	event.preventDefault();
});