var source   = $('#results-template').html();
var template = Handlebars.compile(source);


$( "#search-form" ).submit(function( event ) {
	
	// get search term from input
	// send it to cloud. get results. populate column with results.
	var q = $( "input:first" ).val();
	var url = 'http://librarycloud.harvard.edu/v1/api/item/?filter=keyword:' + q + '&limit=3';
	
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
                    success: function(data){
                        image.attr('src', data[0].thumbnail);
                    }
                });
            });
        }
   });

    event.preventDefault();
});

$( "#pick-form" ).submit(function(event){
    var selected_by = $('#moniker').val() + ' in ' + $('#library').val();
    var title = $('.picked').find('.title').text();
    var hollis = $('.picked').data('hollis');
    $.ajax({
        url: 'add.php',
        type: 'POST',
        data: {title: title, hollis: hollis, selected_by: selected_by},
        success: function(data){
            $('#pick-form').fadeOut();
            $('#pick-in-stone').text(selected_by).fadeIn();
        }
    });
    event.preventDefault();

});

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