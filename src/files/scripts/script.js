(function($) {
	$('html')
		.removeClass('no-js')
		.addClass('js');


	// owl carousel
	$('.carousel').owlCarousel({
		addClassActive: true,
		navigation: true,
		pagination: false,
		rewindNav: false,
		singleItem: true
	});

	$('img').unveil();
})(jQuery);