var items; // Our selections.

Handlebars.registerHelper('dotdotdot', function(str, desired_length) {
  if (str.length > desired_length)
    return str.substring(0,desired_length) + '...';
  return str;
});

Handlebars.registerHelper("last_image_helper", function(image_index) {
    // If we hit index 9, we've loaded 10 images, so that's where 
    // we'll set our waypoint (for infinite scrolling)
  if (image_index== 9) {
      return 'last-image';
  }
});

var get_items = function() {
    $.ajax({
        url: 'services/read.php',
        dataType: 'json',
        cache: false,
        success: function(data) {
            items = data.items;
            draw_selections();
        }
    });
}

$( "#filters" ).on( "click", ".filter", function() {
    $('.filter-active').removeClass('filter-active').addClass('filter');
    $(this).addClass('filter-active').removeClass('filter');
    $(this).find('.glyphicon').addClass('glyphicon-remove');
    var category = $(this).data('category');
    $.ajax({
        url: 'services/read.php?filter=' + category,
        dataType: 'json',
        cache: false,
        success: function(data) {
            items = data.items;
            $("#staff-picks").fadeOut("slow", function() {
				$('#staff-picks').html('');
				draw_selections();
				$('#staff-picks').fadeIn();
			});
        }
    });
});

$( "#filters" ).on( "click", ".filter-active", function() {
    $(this).removeClass('filter-active').addClass('filter');
    $(this).find('.glyphicon').removeClass('glyphicon-remove');
    $("#staff-picks").fadeOut("slow", function() {
        $('#staff-picks').html('');
		get_items();
		$('#staff-picks').fadeIn();
	});
});

var selections_source = $('#pick-template').html();
var selections_template = Handlebars.compile(selections_source);

var draw_selections = function() {
    if (items.length){
        items_to_draw = items.splice(0, 20);
        $('.last-image').removeClass('last-image');
        $('#staff-picks').append(selections_template({pick: items_to_draw}));

        $('.last-image').waypoint(function(direction) {
            if (direction === 'right'){
                draw_selections();
            }
        }, {
                horizontal: true,
                context: '.main-container'
            });
    }
}

// pick selection code
$('#add-pick').click(function(){
	 $( "#pick-container" ).animate({
		left: "+=255",
		}, 500, function() {
		$('#add-pick,.proj-desc, .proj-desc-title, #lil').fadeOut(350);
		$('#search-box').select();
		$('.target-group').fadeIn(350);
	});
	//$('.search-hollis').toggle('slide');
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

    if (!q) {
        return;
    }

    $('#loading-img').fadeIn('fast');

    //var url = 'http://librarycloud.harvard.edu/v1/api/item/?filter=keyword:' + q + '&start=' + start + '&limit=3';
    var url = "services/search.php?q=" + q + "&start=" + start;
    $.ajax({
        url: url,
        dataType: 'json',
        success: function(data){
            $('#results').html(template({results: data['docs']}));
            num_found = data.num_found;
            //$('#result_count').html(num_found.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' matches');
            if (!num_found){
                $('#result_count').html("No results found");
            }
            button_manager();
            $('#loading-img').fadeOut('fast');
            $( ".result-item" ).draggable({ revert: "invalid", cursor: 'move' });
            $( ".cover-image" ).each(function( item ) {
                var image = $(this);
                var isbn = $(this).data('isbn');
                $.ajax({
                    url: 'services/amazon.php?query=' + isbn,
                    dataType: 'json',
                    success: function(data) {
                        if(data[0]) {
                            image.attr('src', data[0].thumbnail).attr('data-cover', data[0].display);
                        }
                    },
                    complete: function(data) {
                        var attr = $(image).attr('src');
                        if (!attr) {
                            var stock_cover_num = Math.floor(Math.random() * 4) + 1;
                            var image_cover_path = 'img/covers/stock/cover' + stock_cover_num + '.png'
                            image.attr('src', image_cover_path).attr('data-cover', image_cover_path);
                        }
                    }
                });
            });
        }
   });
}

$( "#pick-form" ).submit(function(event){
    
    var moniker = "A reader";
    var location = "the library";
    
    if ($('#moniker').val()) {
        moniker = $('#moniker').val();
    }
    
    if ($('#library').val()) {
        location = $('#library').val();
    }
    

    var selected_by = moniker + ' in ' + location;
    //var title = $('.picked').find('.title').text();
    var title = $('.picked').data('title');
    var hollis = $('.picked').data('hollis');
    var cover = $('.picked img').data('cover');
    $.ajax({
        url: 'services/add.php',
        type: 'POST',
        data: {title: title, hollis: hollis, selected_by: selected_by, cover_path: cover},
        success: function(data){
            $("#pick-container").animate({
				'margin-left': "-=645",
				}, 400, function() {
					 $("#pick-container").fadeOut("slow", function() {
					     $('#staff-picks').html('');
					     get_items();
                         $("#pick-container").animate({opacity: '100%'}, 'slow', function() {
                             $("#pick-container").css('display', 'block')
                         });
					});
					
			});
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
    $('#result_count').html("");
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
    if (!(start + 3 >= 25)) {
        start = start + 3;
    }
    button_manager();
    search_lc();
});

$("#results").hover(function() {
    $("#drop-box").addClass("target-highlight");
});

$( "#results" ).hover(
    function() {
        $("#drop-box").addClass("target-highlight");
    }, function() {
        $("#drop-box").removeClass("target-highlight");
    }
);

// When an items is dragged from the the results list to the box
$( "#drop-box" ).droppable({
    activeClass: 'target-highlight',
    hoverClass: 'target-hovering',
    drop: function( event, ui ) {
        $('.result-item').draggable('disable');
        $('.target-group').fadeOut('slow');
        $('#pick-form').fadeIn('slow');
        $('#moniker').select();
        $( this ).parent()
        .addClass("target-acquired");
        $(ui.draggable).addClass('picked');
    }
});

/*$('#library').typeahead({
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
});*/


// Managing the paging buttons on page load
button_manager();

// Display items on page load
get_items();