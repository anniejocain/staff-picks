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

get_items();