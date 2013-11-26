// build handlebars template to randomly pick book cover and size. Up to 400 of them. Place them in three rows.

var get_column_contents = function () {
	// create a list of images to populate bootstrap column
	// get mix of size and images. random over four images, favor regular size
	
	var rando_img, form;
	var image_list =[];
	
	for (var i=0; i < 100; i++) {
		
		rando_img = Math.floor(Math.random() * (4 - 1 + 1) + 1);
		
		// Get the short form every thrid draw
		form = 'regular';
		if (Math.floor(Math.random() * (3 - 1 + 1) + 1) == 3) {
			form = 'short';
		} 
		
		image_list.push({image: 'img/' + form + '/cover' + rando_img + '.png'});
	}
	
	
	return {pick: image_list};
}

var get_items = function() {
    $.ajax({
        url: 'services/read.php',
        dataType: 'json',
        success: function(data){
        	var source = $('#pick-template').html();
            var template = Handlebars.compile(source);
            $('#pick-container').html(template({pick: data.items}));
        }
    });
}

// pick selection code

$('#add-pick').click(function(){
	$('.search-hollis').toggle('slide');
	$('#pick-form').fadeIn('slow');
});

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

    var url = 'http://librarycloud.harvard.edu/v1/api/item/?filter=keyword:' + q + '&start=' + start + '&limit=3';
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
                    url: 'services/amazon.php?query=' + isbn,
                    dataType: 'json',
                    success: function(data){
                        if(data[0]) {
                            image.attr('src', data[0].thumbnail).attr('data-cover', data[0].display);
                        }
                    }
                });
            });
        }
   });
}

$( "#pick-form" ).submit(function(event){
    var selected_by = $('#moniker').val() + ' in ' + $('#library').val();
    var title = $('.picked').find('.title').text();
    var hollis = $('.picked').data('hollis');
    var cover = $('.picked img').data('cover');
    $.ajax({
        url: 'services/add.php',
        type: 'POST',
        data: {title: title, hollis: hollis, selected_by: selected_by, cover_path: cover},
        success: function(data){
            $('#pick-form').fadeOut();
            $('#pick-in-stone').text(selected_by).fadeIn();
        }
    });
    event.preventDefault();
});    

var button_manager = function() {
    // A helper to disable/enable our paging buttons
    
    // Prev paging button
    if (start <= 0) {
        $("#search-prev").addClass('disabled');
    } else {
        $("#search-prev").removeClass('disabled');
    }    

    // Next paging button    
    if ((start + 3 >= num_found)) {
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
    start = start - 3;
    if (start < 0) {
        start = 0;
    }
    button_manager();
    search_lc();
});

// When the next paging button is clicked
$( "#search-next" ).click(function() {
    if (!(start + 3 >= num_found)) {
        start = start + 3;
    }
    button_manager();
    search_lc();
});

// When an items is dragged from the the results list to the box
$( "#drop-box" ).droppable({
    drop: function( event, ui ) {
        $('.result-item').draggable('disable');
        $( this )
        .addClass( "ui-state-highlight" ).addClass('full');
        $(ui.draggable).addClass('picked');
    }
});

$('#library').typeahead({
name: 'library',
local: [
"Abraham Pollen Archives and Rare Book Library",
"African and African American Studies Reading Room ",
"Andover-Harvard Theological Library",
"Arnold Arboretum Horticultural Library ",
"Arthur and Elizabeth Schlesinger Library on the History of Women in America",
"Baker Library",
"Belfer Center Library",
"Biblioteca Berenson",
"Birkhoff Mathematical Library",
"Botany Libraries",
"Cabot Science Library",
"Center for Hellenic Studies LibraryCenter for Hellenic Studies Library",
"Center for Population Studies LibraryCenter for Population Studies Library",
"Center for the History of MedicineCenter for the History of Medicine",
"Chemistry and Chemical Biology LibraryChemistry Library",
"Child Memorial LibraryChild Memorial Library",
"Collection of Historical Scientific InstrumentsCollection of Historical Scientific Instruments",
"Countway Library of Medicine",
"Derek Bok Center for Teaching and LearningDerek Bok Center for Teaching and learning",
"Harvard University Development Office LibraryDevelopment Office Library",
"Dumbarton Oaks",
"Loeb Music LibraryEda Kuhn Loeb Music Library",
"Episcopal Divinity School LibraryEpiscopal Divinity School Library",
"Ernst Mayr Library of the Museum of Comparative ZoologyErnst Mayr Library",
"Fine Arts Library",
"Celtic Seminar LibraryFred Norris Robinson Celtic Seminar Library",
"Fung Library",
"Gordon McKay Library and Blue Hill Meteorological Observatory Library",
"Government Documents and Microforms Collection",
"Grossman Library and Resource Center for the Harvard Extension SchoolGrossman Library",
"Harvard Film Archive",
"Harvard Forest Library",
"Harvard Kennedy School Library & Knowledge Services",
"Harvard Law School Library",
"Harvard Library",
"Harvard University Archives",
"Harvard-Yenching Library",
"History Departmental Library",
"Houghton Library",
"Kirkland House Library",
"Lamont Library",
"Loeb Design Library",
"Monroe C. Gutman Library",
"Nieman Foundation",
"Office of Career Services Library",
"Peabody Museum Archives",
"Physics Research Library",
"Primate Center Library",
"Property Information Resource Center",
"Robbins Library of Philosophy",
"The Harvard Dataverse Network",
"Tozzer Library",
"Ukrainian Research Institute Reference Library",
"Weissman Preservation Center Library",
"Widener Library",
"Wolbach Library"
]
});

// Managing the paging buttons on page load
button_manager();

// Display items on page load
get_items();